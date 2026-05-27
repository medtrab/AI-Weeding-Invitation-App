import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"], weight: ["300","400","500","600"], style: ["normal","italic"],
  variable: "--font-cormorant", display: "swap",
});
const jost = Jost({
  subsets: ["latin"], weight: ["200","300","400","500"],
  variable: "--font-jost", display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Invité — AI Invitation Platform", template: "%s · Invité" },
  description: "Create breathtaking AI-powered wedding and event invitations.",
  manifest: "/manifest.json",
  themeColor: "#0D0B08",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
