import {
  getAddressFromPublicKey,
  getTransactionDecoder,
} from "@solana/web3.js";
import { SolanaAgentKit } from "../index";
import { LuloAccountDetailsResponse, LuloDepositAssetMint } from "../types";
import { getPriorityFees } from "../utils/send_tx";
import { LULO_API } from "../constants";

/**
 * Lend tokens for yields using Lulo
 * @param agent SolanaAgentKit instance
 * @param asset Mint address of the token to lend (as supported by Lulo)
 * @param amount Amount to lend (in token decimals)
 * @param LULO_API_KEY Valid API key for Lulo
 * @returns Transaction signature
 */
export async function lendAsset(
  agent: SolanaAgentKit,
  asset: LuloDepositAssetMint,
  amount: number,
  LULO_API_KEY = "",
): Promise<string> {
  try {
    if (!LULO_API_KEY) {
      throw new Error("Missing Lulo API key");
    }

    const agentAddress = (
      await getAddressFromPublicKey(agent.wallet.publicKey)
    ).toString();

    const request = {
      owner: agentAddress,
      mintAddress: asset.toString(),
      depositAmount: amount.toString(),
    };

    const priorityFees = await getPriorityFees(agent.rpc);
    const priority = `?priorityFee=${priorityFees.median}`;

    const response = await fetch(
      `${LULO_API}/generate/account/deposit${priority}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-wallet-pubkey": agentAddress,
          "x-api-key": LULO_API_KEY,
        },
        body: JSON.stringify(request),
      },
    );

    const {
      data: { transactionMeta },
    } = await response.json();

    const transactionDecoder = getTransactionDecoder();

    const luloTxn = transactionDecoder.decode(transactionMeta[0].transaction);

    // Sign and send transaction
    luloTxn.sign([agent.wallet]);
    const signature = await agent.rpc.sendTransaction(luloTxn);

    return signature;
  } catch (error: any) {
    throw new Error(`Lending failed: ${error.message}`);
  }
}

/**
 * Fetch lending details for agent
 * @param agent SolanaAgentKit instance
 * @param LULO_API_KEY Valid API key for Lulo
 * @returns Lending account details
 */
export async function getLendingDetails(
  agent: SolanaAgentKit,
  LULO_API_KEY = "",
): Promise<LuloAccountDetailsResponse> {
  try {
    if (!LULO_API_KEY) {
      throw new Error("Missing Lulo API key");
    }

    const agentAddress = (
      await getAddressFromPublicKey(agent.wallet.publicKey)
    ).toString();

    const response = await fetch(`${LULO_API}/account`, {
      headers: {
        "x-wallet-pubkey": agentAddress,
        "x-api-key": LULO_API_KEY,
      },
    });

    const { data } = await response.json();

    return data as LuloAccountDetailsResponse;
  } catch (error: any) {
    throw new Error(`Failed to fetch lending details: ${error.message}`);
  }
}
