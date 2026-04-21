import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { wagmiConfig } from "./lib/wagmi";
import { Layout } from "./components/Layout";
import { Landing } from "./pages/Landing";
import { HowItWorks } from "./pages/HowItWorks";
import { About } from "./pages/About";
import { Claim } from "./pages/Claim";
import { Asnaf } from "./pages/Asnaf";
import { Dashboard } from "./pages/Dashboard";
import "./styles/index.css";

const queryClient = new QueryClient();

const tawfTheme = lightTheme({
  accentColor: "#0F3D30",
  accentColorForeground: "#F9F6F0",
  borderRadius: "large",
  fontStack: "system",
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={tawfTheme}>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Landing />} />
                <Route path="how-it-works" element={<HowItWorks />} />
                <Route path="about" element={<About />} />
                <Route path="claim" element={<Claim />} />
                <Route path="asnaf" element={<Asnaf />} />
                <Route path="dashboard" element={<Dashboard />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
