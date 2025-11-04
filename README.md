# The Graph For Morpheus Smart Contracts

This is the graph for Morpheus Smart Contracts.

# Deployment
- `npm run prepare:ethereum-mainnet` or `npm run prepare:ethereum-sepolia`
- `npm run codegen`
- `npm run build`
- `npx graph auth --studio YOUR_STUDIO_KEY`
- `npx graph deploy --studio YOUR_STUDIO_NAME`


npm run prepare:ethereum-mainnet && npm run codegen && npm run build && npx graph deploy morpheus-mainnet-v-2 \
  --version-label v0.0.1-new-version \
  --node https://subgraphs.alchemy.com/api/subgraphs/deploy \
  --deploy-key eUWBRZLfXuDPj \
  --ipfs https://ipfs.satsuma.xyz

npm run prepare:ethereum-mainnet && npm run codegen && npm run build
npm run prepare:ethereum-mainnet && npm run codegen && npm run build && npx graph deploy morpheus-mainnet-v-2


graph deploy example-subgraph-name \
  --version-label v0.0.1-new-version \
  --node https://subgraphs.alchemy.com/api/subgraphs/deploy \
  --deploy-key eUWBRZLfXuDPj \
  --ipfs https://ipfs.satsuma.xyz