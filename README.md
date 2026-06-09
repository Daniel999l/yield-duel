# Yield Duel

Human vs AI RWA treasury benchmark on Mantle Sepolia testnet.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js, neobrutalism UI |
| Wallet | RainbowKit + wagmi (MetaMask / injected) |
| Chain | Mantle Sepolia (testnet) |
| Contract | YieldDuelLog.sol |
| Agent reasoning | Groq |
| Database | MongoDB |

## Quick Start

```bash
npm install
cp env.example .env.local
npm run dev
```

## Deploy on Mantle Sepolia (testnet)

### 1. Set up `.env.local`

```
DEPLOYER_PRIVATE_KEY=your_deployer_wallet_private_key
```

Fund that wallet with testnet MNT from a Mantle Sepolia faucet.

### 2. Deploy the contract

```bash
npm run compile
npm run deploy:mantle
```

Copy the printed address into `.env.local`:

```
NEXT_PUBLIC_YIELD_DUEL_CONTRACT=0xYourDeployedAddress
```

Restart `npm run dev`.

### 3. Play a live duel

1. Open http://localhost:3000
2. Click **Connect Wallet** (MetaMask or browser wallet)
3. Switch to **Mantle Sepolia** in your wallet
4. Set allocation sliders
5. Click **Commit Duel On-Chain**
6. Confirm the transaction
7. View the real tx on [Mantle Sepolia Explorer](https://sepolia.mantlescan.xyz)

### Optional: verify contract

After deploy, with an [Etherscan API key](https://etherscan.io/myapikey) in `.env.local`:

```bash
npx hardhat verify --network mantleSepolia <CONTRACT_ADDRESS>
```

The same Etherscan key works for Mantle Sepolia (chain ID 5003) via Etherscan V2 API.

## Wallet connect

No WalletConnect Cloud signup needed. The app uses RainbowKit with injected browser wallets (MetaMask, etc.) only.

## Groq + MongoDB (optional)

Add to `.env.local` when ready:

```
GROQ_API_KEY=your_groq_key
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=yield-duel
```

- **Groq:** TreasuryClaw reasoning bullets after each duel
- **MongoDB:** stores every duel, powers the live leaderboard

Without these keys the app still runs. Groq falls back to rule-based reasoning. MongoDB falls back to demo leaderboard data.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local app |
| `npm run compile` | Compile Solidity contracts |
| `npm run deploy:mantle` | Deploy to Mantle Sepolia testnet |
| `npm run build` | Production build |

## License

MIT