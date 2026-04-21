import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { baseSepolia } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "tawf-did",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "tawf-did-dev",
  chains: [baseSepolia],
  ssr: false,
});
