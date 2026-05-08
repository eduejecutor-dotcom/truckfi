# 🚛 TruckFi — Real World Asset Protocol on Solana

TruckFi tokenizes real freight trucks as NFTs on Solana. Holders fund the truck and earn 95% of monthly revenue — fully on-chain.

## How it works

1. **Buy an NFT** — 200 NFTs at $160 USD each fund a JAC Runner truck (~$32,000 USD)
2. **Truck operates** — Real freight routes on Chile's Route 5 (Santiago → Concepción)
3. **Earn revenue** — 95% of monthly net income distributed to NFT holders on-chain
4. **Exit anytime** — NFTs are transferable on secondary markets

## Numbers (real, verified)

| Metric | Value |
|--------|-------|
| Truck model | JAC Runner (new) |
| Truck price | ~$32,000 USD |
| NFTs | 200 × $160 USD |
| Monthly gross revenue | ~$7,800 USD |
| Monthly net (after costs) | ~$3,450 USD |
| Holder share (95%) | ~$3,278 USD/month |
| Per NFT monthly | ~$16 USD |
| Estimated APY | ~12% |

## Tech Stack

- **Blockchain**: Solana (devnet)
- **Smart Contracts**: Anchor framework
- **NFTs**: Metaplex
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Wallet**: Phantom via @solana/wallet-adapter
- **Revenue Distribution**: Custom SPL token program

## Routes

- Santiago → Concepción (500 km) — ~$450,000 CLP/trip
- Santiago → Temuco (670 km) — ~$600,000 CLP/trip
- Cargo sourcing: FleteRetorno.cl, Sotraser network

## Smart Contract

The TruckFi Anchor program handles:
- NFT minting (200 supply, 1 collection)
- Revenue deposits by the operator
- Proportional distribution to holders (95/5 split)
- Holder registry via PDAs

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Hackathon

Built for the **Solana Frontier Hackathon** (April 6 – May 11, 2026) by Colosseum.
Category: Real World Assets (RWA)

## Team

- **TaTa** — Founder, Chile

## License

MIT
