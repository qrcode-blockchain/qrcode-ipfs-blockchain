import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";



const spacegrotesk = Space_Grotesk({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "SecureQR-IPFS",
  description: "QR Codes Reinvented with Blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={spacegrotesk.className}
      >
        {children}
      </body>
    </html>
  );
}
