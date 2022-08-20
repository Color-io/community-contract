import {expect} from 'chai';
import {ethers} from 'hardhat';
import {loadFixture} from '@nomicfoundation/hardhat-network-helpers';
import {Community, CommunityFactory__factory, CommunityV2__factory, Community__factory} from '../typechain-types';

const nftCommunityDummyData = [
  {
    name: 'BABA',
    symbol: 'BABANFT',
    logoUrl: 'https://jingculturecommerce.com/wp-content/uploads/2021/09/sothebys-bored-kennel-1024x678.jpg',
    bannerUrl: 'https://jingculturecommerce.com/wp-content/uploads/2021/09/sothebys-bored-kennel-1024x678.jpg',
    description: 'BABA',
    nftImageUrl: 'https://jingculturecommerce.com/wp-content/uploads/2021/09/sothebys-bored-kennel-1024x678.jpg',
    nftSupply: 100,
    mintPrice: ethers.utils.parseEther('0.1'),
  },
  {
    name: 'LALA',
    symbol: 'LALANFT',
    logoUrl: 'https://jingculturecommerce.com/wp-content/uploads/2021/09/sothebys-bored-kennel-1024x678.jpg',
    bannerUrl: 'https://jingculturecommerce.com/wp-content/uploads/2021/09/sothebys-bored-kennel-1024x678.jpg',
    description: 'LALA',
    nftImageUrl: 'https://jingculturecommerce.com/wp-content/uploads/2021/09/sothebys-bored-kennel-1024x678.jpg',
    nftSupply: 123,
    mintPrice: ethers.utils.parseEther('0.1'),
  },
];

type CreateCommunityParameters = [string, string, string, string, string, string, number, number];

describe('Community', async function () {
  async function deployCommunityFixture() {
    const Community = (await ethers.getContractFactory('Community')) as Community__factory;
    const community = await Community.deploy();

    const CommunityFactory = (await ethers.getContractFactory('CommunityFactory')) as CommunityFactory__factory;
    const communityFactory = await CommunityFactory.deploy(community.address);

    const CommunityV2 = (await ethers.getContractFactory('CommunityV2')) as CommunityV2__factory;
    const communityV2 = await CommunityV2.deploy();

    return {community, communityFactory, communityV2};
  }

  it('should return `LFG`', async function () {
    const {community} = await loadFixture(deployCommunityFixture);
    expect(await community.getLFG()).to.equal('LFG');
  });

  describe('Community Factory', async () => {
    it('should return the community/implementation address', async () => {
      const {communityFactory, community} = await loadFixture(deployCommunityFixture);

      const implementationAddress = await community.address;
      expect(await communityFactory.getImplementation()).to.not.be.null;
      expect(await communityFactory.getImplementation()).to.equal(implementationAddress);
    });

    it('should return the beacon address', async () => {
      const {communityFactory} = await loadFixture(deployCommunityFixture);

      expect(await communityFactory.getBeacon()).to.not.be.null;
      expect(await communityFactory.getBeacon()).to.not.be.undefined;
    });

    describe('Create Community', async () => {
      it('should be able to create community', async () => {
        const [owner, communityCreator] = await ethers.getSigners();
        const {communityFactory} = await loadFixture(deployCommunityFixture);

        await communityFactory
          .connect(communityCreator)
          .createCommunity(...(Object.values(nftCommunityDummyData[0]) as CreateCommunityParameters));
        const creatorCommunities = await communityFactory.getOwnerCommunities(communityCreator.address);

        expect(creatorCommunities).to.not.be.null;
        expect(creatorCommunities).to.not.be.undefined;
        expect(creatorCommunities.length).to.equal(1);

        const createdCommunity = (await ethers.getContractAt('Community', creatorCommunities[0])) as Community;
        expect(await createdCommunity.name()).to.equal('BABA');
        expect(await createdCommunity.symbol()).to.equal('BABANFT');
      });

      it('created community owner should be community creator', async () => {
        const [owner, communityCreator] = await ethers.getSigners();
        const {communityFactory} = await loadFixture(deployCommunityFixture);

        await communityFactory
          .connect(communityCreator)
          .createCommunity(...(Object.values(nftCommunityDummyData[1]) as CreateCommunityParameters));
        const creatorCommunities = await communityFactory.getOwnerCommunities(communityCreator.address);

        const createdCommunity = await ethers.getContractAt('Community', creatorCommunities[0]);

        expect(await createdCommunity.owner()).to.equal(communityCreator.address);
      });
    });

    describe('Upgrade Community Contract', async () => {
      it('should be able to upgrade implementation address', async () => {
        const {communityFactory, communityV2} = await loadFixture(deployCommunityFixture);

        const communityV2Address = communityV2.address;
        const beaconAddress = await communityFactory.getBeacon();

        const beaconContract = await ethers.getContractAt('CommunityBeacon', beaconAddress);
        await beaconContract.update(communityV2Address);

        expect(await beaconContract.implementation()).to.equal(communityV2Address);
        expect(await communityFactory.getImplementation()).to.equal(communityV2Address);
        expect(await communityV2.getV2()).to.equal('V2');
      });
    });
  });
});
