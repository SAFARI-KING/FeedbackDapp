require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: "https://ancient-sly-arrow.ethereum-goerli.discover.quiknode.pro/bd9bfa5a2f75f8227663653da20e51140c75cfbe/",
      accounts: [
        "1749f2b6deec5cdbbe871dec3e36d1b3408d535744a31cb96cdb9b7857658ddf",
      ],
    },
  },
};
