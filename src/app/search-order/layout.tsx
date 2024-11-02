import type { Metadata } from "next";
import React from "react";
import { LayoutProps } from "../../../.next/types/app/layout";

export const metadata: Metadata = {
  title: "Chargebee Documentation",
  description: "Learn everything about configuring Chargebee",
  openGraph: {
    title: "Chargebee Documentation",
    description: "Learn everything about configuring Chargebee",
    type: "website",
    images: [
      {
        url: "https://www.chargebee.com/static/resources/og/chargebee.png",
      },
    ],
  },
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen">
      {/* headerNode */}
      <div className="flex flex-row flex-grow max-w-[80rem] py-0 px-[20px] ml-auto mr-auto h-full w-full">
        {/* Navigation content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
