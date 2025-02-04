import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalSideBar from "../components/ConditionalSideBar";
import DataFetching from "@/DataFetching";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Furniro Admin",
  description: "Furniro: A cutting-edge eCommerce platform...",
  icons: {
    icon: [
      { url: "/logo1.png", sizes: "16x16" },
      { url: "/logo1.png", sizes: "32x32" },
      { url: "/logo1.png", sizes: "96x96" }
    ]
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <DataFetching />
      <body className={inter.className}>

        {children}
        <ConditionalSideBar />
        </body>
    </html>
  );
}
