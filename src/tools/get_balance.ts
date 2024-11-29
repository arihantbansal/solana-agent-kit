import { Address, getAddressFromPublicKey, lamports } from "@solana/web3.js";
import { SolanaAgentKit } from "../index";

/**
 * Get the balance of SOL or an SPL token for the agent's wallet
 * @param agent - SolanaAgentKit instance
 * @param token_address - Optional SPL token mint address. If not provided, returns SOL balance
 * @returns Promise resolving to the balance as a number (in UI units) or null if account doesn't exist
 */
export async function get_balance(
  agent: SolanaAgentKit,
  token_address?: Address,
) {
  if (!token_address)
    return (
      (
        await agent.rpc
          .getBalance(await getAddressFromPublicKey(agent.wallet_address))
          .send()
      ).value / lamports(1_000_000_000n)
    );

  const token_account = await agent.rpc
    .getTokenAccountBalance(token_address)
    .send();
  return token_account.value.uiAmount;
}
