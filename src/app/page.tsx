"use client";

import Link from "next/link";
import Login from "@/components/Login";
import Orders from "@/components/Orders";
import { OrderDetails } from "@/scraping/amazon/orderScraping";
import React, { useState } from "react";

export default function Home() {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<
    "amazon" | "ajio" | null
  >(null);

  const renderPlatformSelection = () => {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Select E-commerce Platform
        </h1>
        <div className="space-y-6">
          <div className="flex gap-4 justify-center">
            <button
              className="w-32 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg 
                         hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5 
                         transition-all duration-200 shadow-md font-medium"
              onClick={() => setSelectedPlatform("amazon")}
            >
              Amazon
            </button>
            <button
              className="w-32 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg 
                         hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5 
                         transition-all duration-200 shadow-md font-medium"
              onClick={() => setSelectedPlatform("ajio")}
            >
              Ajio
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          <Link
            href="/search-order"
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r 
                     from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 
                     hover:to-green-700 transform hover:-translate-y-0.5 transition-all 
                     duration-200 shadow-md font-medium"
          >
            <span>Go to Product Search</span>
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
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      {!selectedPlatform ? (
        renderPlatformSelection()
      ) : !loginSuccess ? (
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <button
              onClick={() => setSelectedPlatform(null)}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 gap-2 
                       transition-colors duration-200"
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
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Back to Platform Selection</span>
            </button>
            <Link
              href="/search-order"
              className="inline-flex items-center text-blue-500 hover:text-blue-600 gap-2 
                       font-medium transition-colors duration-200"
            >
              <span>Go to Product Search</span>
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
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <Login
              platform={selectedPlatform}
              onLoginSuccess={(data) => {
                if (selectedPlatform === "ajio") {
                  setLoginSuccess(true);
                  setLoginMessage(data as string);
                } else {
                  setOrders(data as OrderDetails[]);
                  setLoginSuccess(true);
                }
              }}
            />
          </div>
        </div>
      ) : selectedPlatform === "ajio" ? (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="text-center text-xl font-medium text-gray-800">
            {loginMessage}
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <Orders orders={orders} />
        </div>
      )}
    </main>
  );
}
