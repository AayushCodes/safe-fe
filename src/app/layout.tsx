import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Safe Multisig",
  description: "A safe multisig wallet frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
