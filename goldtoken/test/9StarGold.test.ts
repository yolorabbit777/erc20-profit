import { expect } from "chai";
import { ethers } from "hardhat";
import { NineStarGold } from "../typechain-types";

describe("9StarGold", function () {
  let nineStarGold: NineStarGold;
  let owner: any;
  let user1: any;
  let user2: any;
  let profitWallet: any;

  beforeEach(async function () {
    [owner, user1, user2, profitWallet] = await ethers.getSigners();

    const NineStarGoldFactory = await ethers.getContractFactory("NineStarGold");
    nineStarGold = await NineStarGoldFactory.deploy(owner.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await nineStarGold.owner()).to.equal(owner.address);
    });

    it("Should set the initial profit wallet to owner", async function () {
      expect(await nineStarGold.profitWallet()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await nineStarGold.name()).to.equal("9StarGold");
      expect(await nineStarGold.symbol()).to.equal("9SG");
    });

    it("Should have 18 decimals", async function () {
      expect(await nineStarGold.decimals()).to.equal(18);
    });
  });

  describe("buyGold", function () {
    it("Should mint tokens and send profit tokens when buying gold", async function () {
      const ethAmount = ethers.parseEther("1.0");
      const expectedProfit = ethAmount * 100n / 10000n; // 1% profit in tokens
      const expectedUserTokens = ethAmount; // 100% of ETH for user

      const initialUserBalance = await nineStarGold.balanceOf(user1.address);
      const initialProfitWalletBalance = await nineStarGold.balanceOf(profitWallet.address);

      await nineStarGold.connect(user1).buyGold(profitWallet.address, { value: ethAmount });

      const finalUserBalance = await nineStarGold.balanceOf(user1.address);
      const finalProfitWalletBalance = await nineStarGold.balanceOf(profitWallet.address);

      expect(finalUserBalance - initialUserBalance).to.equal(expectedUserTokens);
      expect(finalProfitWalletBalance - initialProfitWalletBalance).to.equal(expectedProfit);
    });

    it("Should emit GoldPurchased event", async function () {
      const ethAmount = ethers.parseEther("1.0");
      const expectedProfit = ethAmount * 100n / 10000n;
      const expectedUserTokens = ethAmount;

      await expect(nineStarGold.connect(user1).buyGold(profitWallet.address, { value: ethAmount }))
        .to.emit(nineStarGold, "GoldPurchased")
        .withArgs(user1.address, ethAmount, expectedUserTokens, expectedProfit);
    });

    it("Should fail when sending 0 ETH", async function () {
      await expect(
        nineStarGold.connect(user1).buyGold(profitWallet.address, { value: 0 })
      ).to.be.revertedWith("9StarGold: Must send ETH to buy gold");
    });

    it("Should fail when profit wallet is zero address", async function () {
      const ethAmount = ethers.parseEther("1.0");
      await expect(
        nineStarGold.connect(user1).buyGold(ethers.ZeroAddress, { value: ethAmount })
      ).to.be.revertedWith("9StarGold: Profit wallet cannot be zero address");
    });

    it("Should handle multiple purchases correctly", async function () {
      const ethAmount1 = ethers.parseEther("1.0");
      const ethAmount2 = ethers.parseEther("2.0");
      
      const expectedProfit1 = ethAmount1 * 100n / 10000n;
      const expectedUserTokens1 = ethAmount1;
      
      const expectedProfit2 = ethAmount2 * 100n / 10000n;
      const expectedUserTokens2 = ethAmount2;

      await nineStarGold.connect(user1).buyGold(profitWallet.address, { value: ethAmount1 });
      await nineStarGold.connect(user2).buyGold(profitWallet.address, { value: ethAmount2 });

      expect(await nineStarGold.balanceOf(user1.address)).to.equal(expectedUserTokens1);
      expect(await nineStarGold.balanceOf(user2.address)).to.equal(expectedUserTokens2);
    });
  });

  describe("setProfitWallet", function () {
    it("Should allow owner to update profit wallet", async function () {
      await nineStarGold.connect(owner).setProfitWallet(user1.address);
      expect(await nineStarGold.profitWallet()).to.equal(user1.address);
    });

    it("Should emit ProfitWalletUpdated event", async function () {
      await expect(nineStarGold.connect(owner).setProfitWallet(user1.address))
        .to.emit(nineStarGold, "ProfitWalletUpdated")
        .withArgs(owner.address, user1.address);
    });

    it("Should fail when non-owner tries to update profit wallet", async function () {
      await expect(
        nineStarGold.connect(user1).setProfitWallet(user2.address)
      ).to.be.revertedWithCustomError(nineStarGold, "OwnableUnauthorizedAccount");
    });

    it("Should fail when setting profit wallet to zero address", async function () {
      await expect(
        nineStarGold.connect(owner).setProfitWallet(ethers.ZeroAddress)
      ).to.be.revertedWith("9StarGold: Profit wallet cannot be zero address");
    });
  });

  describe("withdrawETH", function () {
    it("Should allow owner to withdraw ETH", async function () {
      // First, send some ETH to the contract
      const ethAmount = ethers.parseEther("1.0");
      await user1.sendTransaction({
        to: await nineStarGold.getAddress(),
        value: ethAmount
      });

      const initialBalance = await ethers.provider.getBalance(owner.address);
      await nineStarGold.connect(owner).withdrawETH();
      const finalBalance = await ethers.provider.getBalance(owner.address);

      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should fail when non-owner tries to withdraw ETH", async function () {
      await expect(
        nineStarGold.connect(user1).withdrawETH()
      ).to.be.revertedWithCustomError(nineStarGold, "OwnableUnauthorizedAccount");
    });

    it("Should fail when contract has no ETH", async function () {
      await expect(
        nineStarGold.connect(owner).withdrawETH()
      ).to.be.revertedWith("9StarGold: No ETH to withdraw");
    });
  });

  describe("ERC-20 functionality", function () {
    it("Should allow token transfers", async function () {
      const ethAmount = ethers.parseEther("1.0");
      const expectedProfit = ethAmount * 100n / 10000n;
      const expectedUserTokens = ethAmount;

      await nineStarGold.connect(user1).buyGold(profitWallet.address, { value: ethAmount });

      const transferAmount = ethers.parseEther("0.5");
      await nineStarGold.connect(user1).transfer(user2.address, transferAmount);

      expect(await nineStarGold.balanceOf(user2.address)).to.equal(transferAmount);
      expect(await nineStarGold.balanceOf(user1.address)).to.equal(expectedUserTokens - transferAmount);
    });
  });
});
