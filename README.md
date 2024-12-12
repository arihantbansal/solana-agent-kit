<div align="center">

[Docs](https://solanaagentkit.xyz/) | [Examples](https://github.com/sendaifun/solana-agent-kit/tree/main/test/) | [X](https://x.com/sendaifun)

Solana Agent Kit is an open source public goods for helping folks build on-chain AI agents maintained by [SEND AI](https://www.sendai.fun/)
</div>

A toolkit for agents to interact with and performs actions on Solana, providing easy-to-use functions for token operations, NFT management, trading, and yield farming.

## Key features

- 🪙 Token Operations
  - Deploy new SPL tokens
  - Transfer SOL and SPL tokens
  - Check token balances
  - Stake SOL

- 🖼️ NFT Management
  - Deploy NFT collections
  - Mint NFTs to collections
  - Manage metadata and royalties

- 💱 Trading
  - Integrated Jupiter Exchange support
  - Launch tokens on pump.fun
  - Token swaps with customizable slippage
  - Direct routing options

- 🏦 Yield Farming
  - Lend idle assets to earn interest with Lulo

- 🔗 LangChain Integration
  - Utilize LangChain tools for enhanced blockchain interactions
  - Access a suite of tools for balance checks, transfers, token deployments, and more

## Installation

```bash
npm install solana-agent-kit
```

## Quick Start

```typescript
import { SolanaAgentKit, createSolanaTools } from 'solana-agent-kit';

// Initialize with private key and optional RPC URL
const agent = new SolanaAgentKit(
  'your-private-key',
  'https://api.mainnet-beta.solana.com'
);

// Create LangChain tools
const tools = createSolanaTools(agent);
```

## Usage Examples

### Deploy a New Token

```typescript
import { deploy_token } from 'solana-agent-kit';

const result = await deploy_token(
  agent,
  9, // decimals
  1000000 // initial supply
);

console.log('Token Mint Address:', result.mint.toString());
```

### Create NFT Collection

```typescript
import { deploy_collection } from 'solana-agent-kit';

const collection = await deploy_collection(agent, {
  name: "My NFT Collection",
  uri: "https://arweave.net/metadata.json",
  royaltyBasisPoints: 500, // 5%
  creators: [
    {
      address: "creator-wallet-address",
      percentage: 100
    }
  ]
});
```

### Swap Tokens

```typescript
import { trade } from 'solana-agent-kit';
import { PublicKey } from '@solana/web3.js';

const signature = await trade(
  agent,
  new PublicKey('target-token-mint'),
  100, // amount
  new PublicKey('source-token-mint'),
  300 // 3% slippage
);
```

### Lend Tokens

```typescript
import { lendAsset } from 'solana-agent-kit';
import { PublicKey } from '@solana/web3.js';

const signature = await lendAsset(
  agent,
  new PublicKey('asset-mint'),
  100, // amount
  "lulo-api-key"
);
```

## Contributing

Contributions are welcome! Please refer to the [contribution guidelines](CONTRIBUTING.md) for more information.

## License

GNU License

## Security

This toolkit handles private keys and transactions. Always ensure you're using it in a secure environment and never share your private keys.