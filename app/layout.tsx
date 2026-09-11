import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MosquitoNet — Global Mosquito Intelligence Network",
  description: "Track. Catch. Report. Discover where mosquitoes are winning.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
