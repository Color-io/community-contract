import {loadFixture} from '@nomicfoundation/hardhat-network-helpers';
import {expect} from 'chai';
import {ethers} from 'hardhat';
import {Greeter} from '../typechain-types/index';

describe('Greeter', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function deployHelloWorldGreeterFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const greet = 'Hello, world!';
    const Greeter = await ethers.getContractFactory('Greeter');
    const greeter: Greeter = (await Greeter.deploy(greet)) as Greeter;

    return {greeter, greet, owner, otherAccount};
  }

  describe('Deployment', function () {
    it("should return the new greeting once it's changed", async function () {
      const {greeter} = await loadFixture(deployHelloWorldGreeterFixture);
      await greeter.deployed();
      expect(await greeter.greet()).to.equal('Hello, world!');
      const setGreetingTx = await greeter.setGreeting('Hola, mundo!');

      // wait until the transaction is mined
      await setGreetingTx.wait();
      expect(await greeter.greet()).to.equal('Hola, mundo!');
    });
  });
});
