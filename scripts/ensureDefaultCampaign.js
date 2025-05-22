const hre = require("hardhat");

async function main() {
  // Use the latest deployed contract address
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  const Crowdfunding = await hre.ethers.getContractFactory("Crowdfunding");
  const crowdfunding = Crowdfunding.attach(contractAddress);
  const [deployer] = await hre.ethers.getSigners();

  // Try to get the campaign count (try both .campaignCount() and .getCampaignCount())
  let campaignCount;
  try {
    campaignCount = await crowdfunding.campaignCount();
  } catch {
    try {
      campaignCount = await crowdfunding.getCampaignCount();
    } catch {
      throw new Error("Could not get campaign count from contract");
    }
  }

  if (campaignCount.toNumber() === 0) {
    console.log("No campaigns found. Creating a default campaign...");
    const tx = await crowdfunding.createCampaign(
      "Welcome Campaign",
      "This is a default on-chain campaign always visible for new users.",
      hre.ethers.utils.parseEther("10"), // 10 ETH goal
      30 // 30 days
    );
    await tx.wait();
    console.log("Default campaign created!");
  } else {
    console.log(`There are already ${campaignCount.toNumber()} campaign(s) on-chain.`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}); 