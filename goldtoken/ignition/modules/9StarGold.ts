import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("NineStarGold", (m) => {
  const nineStarGold = m.contract("NineStarGold");

  return { nineStarGold };
});
