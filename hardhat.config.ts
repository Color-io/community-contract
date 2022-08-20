import '@nomicfoundation/hardhat-toolbox';
import '@nomiclabs/hardhat-solhint';
import '@nomicfoundation/hardhat-chai-matchers';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import 'dotenv/config';

import {HardhatUserConfig, task} from 'hardhat/config';

// ref: https://stermi.medium.com/how-to-deploy-your-first-smart-contract-on-ethereum-with-solidity-and-hardhat-22f21d31096e
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    // ref: https://gist.github.com/mingderwang/64046242aabff1e796ecaa4a93792fbd
    // ref: https://hardhat.org/hardhat-runner/docs/config
    ganache: {
      url: 'http://127.0.0.1:7545',
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY || ''}`,
      accounts: [process.env.GOERLI_PRIVATE_KEY || ''],
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY || ''}`,
      accounts: [process.env.GOERLI_PRIVATE_KEY || ''],
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
