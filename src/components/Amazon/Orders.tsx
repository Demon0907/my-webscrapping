import { OrderDetails } from "@/scraping/orderScraping";

interface OrdersProps {
  orders: OrderDetails[];
}

const Orders = ({ orders }: OrdersProps) => {
  return (
    <div className="mt-8 p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Orders</h2>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">No orders found</p>
          <p className="text-gray-400 text-sm mt-2">
            Your Amazon orders will appear here once available
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                  {order.name}
                </h3>
                <div className="flex flex-col gap-2 text-sm text-gray-600">
                  <p className="font-medium">
                    Price: <span className="text-green-600">{order.price}</span>
                  </p>
                  <p>Order Date: {order.orderDate}</p>
                </div>
                <a
                  href={order.productLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 transition-colors inline-flex items-center gap-1 mt-2"
                >
                  View Product
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
