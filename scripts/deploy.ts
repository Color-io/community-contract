import {ethers} from 'hardhat';
import {CommunityFactory__factory, Community__factory} from '../typechain-types';

async function main() {
  const Community = (await ethers.getContractFactory('Community')) as Community__factory;
  const CommunityFactory = (await ethers.getContractFactory('CommunityFactory')) as CommunityFactory__factory;

  const community = await Community.deploy();
  console.log('Community address: ', community.address);

  await community.deployed();

  const communityFactory = await CommunityFactory.deploy(community.address);
  console.log('CommunityFactory address: ', communityFactory.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
