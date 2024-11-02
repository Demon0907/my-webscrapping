"use client";

import AmazonSearchOrder from "@/components/AmazonSearchOrder/AmazonSearchOrder";
import Link from "next/link";
import React from "react";

export default function SearchOrderPage() {
  return (
    <div>
      <div className="p-6 border-b">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 gap-2 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transform group-hover:-translate-x-1 transition-transform"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back to Home</span>
        </Link>
      </div>
      <AmazonSearchOrder />
    </div>
  );
}
