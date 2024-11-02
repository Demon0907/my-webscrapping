import { SearchProduct } from "@/scraping/amazonSearchOrder";

interface ResultsDisplayProps {
  results: Record<string, SearchProduct[]>;
  isLoading: boolean;
}

const OrderDisplay = ({ results, isLoading }: ResultsDisplayProps) => {
  return (
    <section className="flex-grow w-full overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Results</h2>

      {isLoading ? (
        <div role="status" className="flex justify-center items-center py-8">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
            aria-label="Loading"
          ></div>
        </div>
      ) : Object.keys(results).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(results).map(([searchString, products], idx) => (
            <article key={idx} className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">
                {searchString}
              </h3>
              <div className="overflow-x-auto">
                <ul className="flex space-x-4 pb-4 overflow-x-auto">
                  {Array.isArray(products) &&
                    products.map((product, productIdx) => (
                      <li
                        key={productIdx}
                        className="flex-shrink-0 w-64 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow flex flex-col h-48"
                      >
                        <a
                          href={product.productLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium mb-2 line-clamp-3 flex-grow"
                        >
                          {product.name}
                        </a>
                        <div className="mt-auto space-y-2">
                          {product.rating && (
                            <div className="text-sm text-gray-600">
                              ⭐ {product.rating} ({product.globalRating})
                            </div>
                          )}
                          <div className="text-green-600 font-medium text-lg">
                            {product.price}
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">
          No results found. Try searching for something else.
        </p>
      )}
    </section>
  );
};

export default OrderDisplay;
