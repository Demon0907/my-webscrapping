"use client";

import Login from "@/components/Amazon/Login";
import Orders from "@/components/Amazon/Orders";
import { OrderDetails } from "@/scraping/orderScraping";
import React, { useState } from "react";

export default function Home() {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
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
