import type { Metadata } from "next";
import React from "react";
import { LayoutProps } from "../../../.next/types/app/layout";

export const metadata: Metadata = {
  title: "Amazon Product Search",
  description: "Search and display products across Amazon",
  openGraph: {
    title: "Amazon Product Search",
    description: "Search and display products across Amazon",
    type: "website",
    locale: "en_US",
    siteName: "Amazon Product Search",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: "#ffffff",
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen bg-white">
      <div className="flex flex-row flex-grow max-w-[80rem] py-0 px-[20px] mx-auto h-full w-full bg-white">
        <div className="w-full bg-white">{children}</div>
      </div>
    </div>
  );
}
