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
    <div className="min-h-screen flex flex-col bg-white">
      <div className="w-[80rem] mx-auto bg-white">
        <header className="flex justify-between items-center px-8 py-6 border-b sticky top-0 z-10 bg-white">
          <h1 className="text-2xl font-bold text-primary-800">
            Amazon Product Search
          </h1>
          {hasSearched && !showSearch && (
            <button
              onClick={() => setShowSearch(true)}
              className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 
                       transition-all duration-200 flex items-center gap-2 hover:shadow-sm"
            >
              <span>←</span> Back to Search
            </button>
          )}
        </header>

        <main className="flex-1">
          <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)]">
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
