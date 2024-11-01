"use client";

import Login from "@/components/Amazon/Login";
import Orders from "@/components/Amazon/Orders";
import { OrderDetails } from "@/scraping/orderScraping";
import React, { useState } from "react";

export const EBAY_SIGNIN_URL =
  "https://signin.ebay.com/ws/eBayISAPI.dll?SignIn&sgfl=nf&ru=https%3A%2F%2Fwww.ebay.com%2F";

export const MYNTRA_SIGNIN_URL = "https://www.myntra.com/login";

export default function Home() {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  console.log("🚀 ~ Home ~ orders:", orders);
  const [loginSuccess, setLoginSuccess] = useState(false);

  return (
    <main className="min-h-screen p-8">
      {!loginSuccess ? (
        <Login
          onLoginSuccess={(data) => {
            setOrders(data);
            setLoginSuccess(true);
          }}
        />
      ) : (
        <Orders orders={orders} />
      )}
    </main>
  );
}
