import { SearchProduct } from "@/scraping/amazonSearchOrder";

interface ResultsDisplayProps {
  results: Record<string, SearchProduct[]>;
  isLoading: boolean;
}

const OrderDisplay = ({ results, isLoading }: ResultsDisplayProps) => {
  return (
    <section className="flex-grow p-8 bg-white overflow-y-auto">
      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
          <div
            className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 
                     border-t-primary-600"
            aria-label="Loading"
          />
        </div>
      ) : Object.keys(results).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(results).map(([searchString, products], idx) => (
            <article
              key={idx}
              className="border border-gray-100 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold text-primary-800 mb-6">
                Results for &quot;{searchString}&quot;
              </h3>
              <div className="overflow-x-auto">
                <ul className="flex gap-4 pb-4 min-w-full">
                  {Array.isArray(products) &&
                    products.map((product, productIdx) => (
                      <li
                        key={productIdx}
                        className="flex-shrink-0 w-72 bg-white border border-gray-100 
                                 rounded-xl hover:shadow-md transition-all duration-200 
                                 flex flex-col h-52 overflow-hidden group"
                      >
                        <div className="p-4 flex flex-col h-full">
                          <a
                            href={product.productLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-800 hover:text-primary-600 font-medium 
                                     mb-2 line-clamp-3 flex-grow transition-colors 
                                     duration-200"
                          >
                            {product.name}
                          </a>
                          <div className="mt-auto space-y-2 pt-2 border-t border-gray-50">
                            {product.rating && (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <span className="text-yellow-400">★</span>
                                <span>{product.rating}</span>
                                <span className="text-gray-400">
                                  ({product.globalRating})
                                </span>
                              </div>
                            )}
                            <div className="text-primary-600 font-semibold text-lg">
                              {product.price}
                            </div>
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
        <div className="flex flex-col items-center justify-center h-[calc(100vh-10rem)]">
          <p className="text-gray-500 text-lg">
            No results found. Try searching for something else.
          </p>
        </div>
      )}
    </section>
  );
};

export default OrderDisplay;
