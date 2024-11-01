"use client";

import { initialize, login } from "@/scraping/loginScraping3";
import { OrderDetails } from "@/scraping/orderScraping";
import React, { useState } from "react";

export const EBAY_SIGNIN_URL =
  "https://signin.ebay.com/ws/eBayISAPI.dll?SignIn&sgfl=nf&ru=https%3A%2F%2Fwww.ebay.com%2F";

export const MYNTRA_SIGNIN_URL = "https://www.myntra.com/login";

export const AMAZON_SIGNIN_URL =
  "https://www.amazon.in/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.in%2F%3F%26tag%3Dgooghydrabk1-21%26ref%3Dnav_signin%26adgrpid%3D155259813593%26hvpone%3D%26hvptwo%3D%26hvadid%3D713930225169%26hvpos%3D%26hvnetw%3Dg%26hvrand%3D16667852064741063476%26hvqmt%3De%26hvdev%3Dc%26hvdvcmdl%3D%26hvlocint%3D%26hvlocphy%3D9185320%26hvtargid%3Dkwd-64107830%26hydadcr%3D14452_2402225%26gad_source%3D1&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=inflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0";
export default function Home() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  // const [platform, setPlatform] = useState<"amazon" | "ebay" | "myntra">(
  //   "amazon"
  // );

  const [view, setView] = useState<"login" | "orders">("login");

  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await initialize();
      const loginResult = await login(AMAZON_SIGNIN_URL, {
        username: formData.username,
        password: formData.password,
      });

      if (loginResult.success) {
        setView("orders");

        // Set orders from login response
        if (loginResult.orders) {
          setOrders(loginResult.orders);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {view === "login" ? (
        <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg space-y-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-700 block mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none text-gray-900"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 block mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 outline-none text-gray-900"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
            >
              Sign In
            </button>

            <div className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400">
              {loading ? "Logging in..." : "Start Login"}
            </div>
          </form>
        </div>
      ) : null}
      {view === "orders" ? (
        <div className="max-w-4xl mx-auto p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Your Order History
          </h2>
          {orders.map((order) => (
            <div
              key={order.name}
              className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-200 border border-gray-100"
            >
              <div className="flex flex-col space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                  {order.name}
                </h3>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">
                    {order.orderDate}
                  </span>
                  <span className="text-gray-800 font-semibold">
                    {order.price}
                  </span>
                </div>
                <a
                  href={order.productLink}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Product Details
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
