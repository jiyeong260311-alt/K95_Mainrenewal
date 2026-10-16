import type { Metadata } from "next";
import { Shell } from "@/components/sites/k95/Shell";
import "./k95.css";

export const metadata: Metadata = {
  title: { default: "K95 — Brand & Digital Design Studio", template: "%s — K95" },
  description: "Explore brand identity, packaging, editorial and digital design by Studio K95, Catania, Italy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body><Shell>{children}</Shell></body>
    </html>
  );
}
