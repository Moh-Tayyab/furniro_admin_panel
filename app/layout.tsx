import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalSideBar from "./components/ConditionalSideBar";
import DataFetching from "@/DataFetching";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Furniro Admin Panel",
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
