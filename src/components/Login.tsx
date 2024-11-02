"use client";

import { OrderDetails } from "@/scraping/amazon/orderScraping";
import React, { useState } from "react";

interface LoginProps {
  onLoginSuccess: (orders: OrderDetails[] | string) => void;
  platform: "amazon" | "ajio" | null;
}

const Login = ({ onLoginSuccess, platform }: LoginProps) => {
  const [formData, setFormData] = useState<{
    username: string;
    password?: string;
  }>({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/${platform}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (platform === "ajio") {
          onLoginSuccess(data.message);
        } else {
          onLoginSuccess(data.orders);
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("An error occurred during login");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-xl border border-gray-100 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary-800">
          Login to {platform?.toUpperCase()}
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {platform === "amazon" ? "Username" : "Mobile Number"}
            </label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                       outline-none transition-colors hover:border-primary-300"
            />
          </div>
          {platform === "amazon" && (
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                         focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                         outline-none transition-colors hover:border-primary-300"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg
                     hover:bg-primary-700 focus:outline-none focus:ring-2 
                     focus:ring-primary-500 focus:ring-offset-2 
                     disabled:opacity-50 disabled:cursor-not-allowed 
                     transition-colors font-medium shadow-sm hover:shadow-md"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {platform === "ajio"
                  ? "Verifying OTP..."
                  : "Fetching order history..."}
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
