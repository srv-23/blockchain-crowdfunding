# Blockchain Crowdfunding Platform

A decentralized crowdfunding platform built with React, Hardhat, and Solidity. This project allows users to create, fund, and manage crowdfunding campaigns on the Ethereum blockchain.

## Features

- **Create Campaigns**: Users can create new crowdfunding campaigns with a title, description, funding goal, and deadline.
- **Fund Campaigns**: Support campaigns by contributing ETH directly through the platform.
- **Campaign Management**: View campaign details, track progress, and claim funds once the goal is reached.
- **Responsive Design**: A modern, responsive UI that works on desktop and mobile devices.
- **Theme Support**: Light and dark themes for a better user experience.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Smart Contracts**: Solidity, Hardhat
- **Web3 Integration**: ethers.js, MetaMask

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MetaMask browser extension

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blockchain-crowdfunding.git
   cd blockchain-crowdfunding
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local Hardhat node:
   ```bash
   npx hardhat node
   ```

4. Deploy the smart contract:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

5. Create a default campaign (optional):
   ```bash
   npx hardhat run scripts/ensureDefaultCampaign.js --network localhost
   ```

6. Start the development server:
   ```bash
   npm start
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Connect Wallet**: Use MetaMask to connect your Ethereum wallet.
- **Create a Campaign**: Fill out the form to create a new campaign.
- **Fund a Campaign**: Contribute ETH to any active campaign.
- **View Campaigns**: Browse and interact with existing campaigns.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to the Hardhat and ethers.js communities for their excellent documentation and support. 