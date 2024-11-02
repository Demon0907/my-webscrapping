import { OrderDetails } from "@/scraping/amazon/orderScraping";

interface OrdersProps {
  orders: OrderDetails[];
  onBack?: () => void;
}

const Orders = ({ orders, onBack }: OrdersProps) => {
  return (
    <div className="mt-8 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary-800">Your Orders</h2>
        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 text-primary-600 
                   hover:text-primary-700 hover:bg-primary-50 rounded-lg 
                   transition-all duration-200 gap-2 font-medium"
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
          Back to Login
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
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
              className="bg-white rounded-xl border border-gray-100 p-6 
                       hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
                  {order.name}
                </h3>
                <div className="flex flex-col gap-2 text-sm text-gray-600">
                  <p className="font-medium">
                    Price:{" "}
                    <span className="text-primary-600 font-semibold">
                      {order.price}
                    </span>
                  </p>
                  <p>Order Date: {order.orderDate}</p>
                </div>
                <a
                  href={order.productLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 
                           transition-colors inline-flex items-center gap-1 
                           mt-2 font-medium"
                >
                  View Product
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
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
