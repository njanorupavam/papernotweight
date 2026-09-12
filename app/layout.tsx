import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MosquitoNet — Bio-Acoustic Recon & Live Surveillance",
  description:
    "Autonomous bio-acoustic surveillance & real-time vector activity tracking.",
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
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0c141e] text-[#dbe3f2] selection:bg-[#ff553e] selection:text-[#5b0300]">
        {children}
      </body>
    </html>
  );
}
