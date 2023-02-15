async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Get the ContractFactories and Signers here.
  const Feedback = await ethers.getContractFactory("Feedback");

  // deploy contracts
  const feedback = await Feedback.deploy();

  console.log(
    "Deploying contracts with the Feedback Dapp account:",
    feedback.address
  );

  // Save copies of each contracts abi and address to the frontend.
  saveFrontendFiles(feedback, "Feedback");
}

function saveFrontendFiles(contract, name) {
  const path = require("path");
  const fs = require("fs");
  const newPath = path.join(__dirname, "../");

  const contractsDir = newPath + "feedback_dapp/src/abis/contractsData";
  // console.log(contractsDir)

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/${name}-address.json`,
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  const contractArtifact = artifacts.readArtifactSync(name);

  fs.writeFileSync(
    contractsDir + `/${name}.json`,
    JSON.stringify(contractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
