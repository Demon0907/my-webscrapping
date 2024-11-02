import { useState } from "react";
import { SearchProduct } from "@/scraping/amazonSearchOrder";
import SearchForm from "./SearchForm";
import OrderDisplay from "./OrderDisplay";

const AmazonSearchOrder = () => {
  const [results, setResults] = useState<Record<string, SearchProduct[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showSearch, setShowSearch] = useState(true);

  const handleSearch = async (searchStrings: string[]) => {
    setIsLoading(true);
    setHasSearched(true);
    setShowSearch(false);
    try {
      const response = await fetch("/api/amazon-product-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchStrings }),
      });
      const data = await response.json();
      setResults(data.products);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-[80rem] mx-auto">
        <header className="flex justify-between items-center p-6 border-b bg-white">
          <h1 className="text-2xl font-bold text-gray-800">
            Amazon Product Search
          </h1>
          {hasSearched && !showSearch && (
            <button
              onClick={() => setShowSearch(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              ← Back to Search
            </button>
          )}
        </header>

        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col md:flex-row">
            {showSearch ? (
              <SearchForm onSearch={handleSearch} />
            ) : (
              hasSearched && (
                <OrderDisplay results={results} isLoading={isLoading} />
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AmazonSearchOrder;
