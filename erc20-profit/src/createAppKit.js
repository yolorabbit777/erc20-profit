import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { sepolia } from "@reown/appkit/networks";

// 1. Get projectId
const projectId = "4d28c55add44024f728bc6bd37beb077";

// 2. Set the networks
const networks = [sepolia];

// 3. Create a metadata object - optional
const metadata = {
  name: "9StarGold",
  description: "9StarGold",
  url: "https://9stargold.com", // origin must match your domain & subdomain
  icons: ["https://avatars.9stargold.com/"],
};

// 4. Create a AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});