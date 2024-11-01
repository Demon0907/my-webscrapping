"use client";

import Login from "@/components/Amazon/Login";
import Orders from "@/components/Amazon/Orders";
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
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold mb-4">Select E-commerce Platform</h1>
        <div className="flex gap-4">
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setSelectedPlatform("amazon")}
          >
            Amazon
          </button>
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setSelectedPlatform("ajio")}
          >
            Ajio
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen p-8">
      {!selectedPlatform ? (
        renderPlatformSelection()
      ) : !loginSuccess ? (
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
      ) : selectedPlatform === "ajio" ? (
        <div className="text-center text-xl font-medium text-gray-800 p-4">
          {loginMessage}
        </div>
      ) : (
        <Orders orders={orders} />
      )}
    </main>
  );
}
