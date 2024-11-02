import { useState } from "react";
import "rc-slider/assets/index.css";

interface SearchFormProps {
  onSearch: (searchStrings: string[]) => Promise<void>;
}

export interface FilterState {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  resultCount: number;
}

const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [searchStrings, setSearchStrings] = useState<string[]>([""]);

  const addSearchString = () => setSearchStrings([...searchStrings, ""]);
  const handleSearchChange = (index: number, value: string) => {
    const updatedStrings = [...searchStrings];
    updatedStrings[index] = value.trim();
    setSearchStrings(updatedStrings);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (searchStrings.some((str) => !str.trim())) {
      alert("Search terms cannot be empty");
      return;
    }
    await onSearch(searchStrings);
  };

  return (
    <aside className="w-full md:w-96 border-r bg-white">
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset className="space-y-3">
            <legend className="text-lg font-semibold text-primary-800 mb-4">
              Search Products
            </legend>
            {searchStrings.map((string, index) => (
              <div key={index} className="relative">
                <input
                  value={string}
                  onChange={(e) => handleSearchChange(index, e.target.value)}
                  placeholder="Enter search term"
                  className="w-full p-3 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                           outline-none text-gray-800 transition-all duration-200
                           hover:border-primary-300"
                />
              </div>
            ))}
          </fieldset>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={addSearchString}
              className="w-full px-4 py-3 bg-primary-50 text-primary-700 rounded-lg 
                       hover:bg-primary-100 transition-all duration-200 border 
                       border-primary-200 hover:border-primary-300 font-medium"
            >
              + Add Another Search Term
            </button>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg 
                       hover:bg-primary-700 transition-all duration-200 font-medium
                       shadow-sm hover:shadow-md"
            >
              Search Products
            </button>
          </div>
        </form>
      </div>
    </aside>
  );
};

export default SearchForm;
