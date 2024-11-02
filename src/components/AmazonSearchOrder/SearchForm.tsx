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
  // const [filters, setFilters] = useState<FilterState>({
  //   minPrice: 0,
  //   maxPrice: 1000,
  //   minRating: 0,
  //   resultCount: 10,
  // });

  const addSearchString = () => setSearchStrings([...searchStrings, ""]);
  const handleSearchChange = (index: number, value: string) => {
    const updatedStrings = [...searchStrings];
    updatedStrings[index] = value.trim();
    setSearchStrings(updatedStrings);
  };

  // const handleFilterChange = (
  //   key: keyof FilterState,
  //   value: number | number[]
  // ) => {
  //   setFilters((prev) => ({
  //     ...prev,
  //     [key]: value,
  //   }));
  // };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (searchStrings.some((str) => !str.trim())) {
      alert("Search terms cannot be empty");
      return;
    }
    await onSearch(searchStrings);
  };

  return (
    <aside className="md:w-80 flex-shrink-0">
      <form onSubmit={handleSubmit} className="space-y-4 sticky top-6">
        <fieldset className="space-y-2">
          <legend className="sr-only">Search Terms</legend>
          {searchStrings.map((string, index) => (
            <input
              key={index}
              value={string}
              onChange={(e) => handleSearchChange(index, e.target.value)}
              placeholder="Enter search term"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800"
            />
          ))}
        </fieldset>

        {/* <fieldset className="space-y-6 p-4 border border-gray-200 rounded-lg">
          <legend className="text-lg font-semibold text-gray-700">
            Filters
          </legend>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Price Range
            </label>
            <div className="px-2">
              <Slider
                range
                min={0}
                max={1000}
                value={[filters.minPrice, filters.maxPrice]}
                onChange={(value: number | number[]) => {
                  if (Array.isArray(value)) {
                    handleFilterChange("minPrice", value[0]);
                    handleFilterChange("maxPrice", value[1]);
                  }
                }}
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>${filters.minPrice}</span>
                <span>${filters.maxPrice}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Minimum Rating
            </label>
            <div className="px-2">
              <Slider
                min={0}
                max={5}
                step={0.5}
                value={filters.minRating}
                onChange={(value: number | number[]) =>
                  handleFilterChange(
                    "minRating",
                    Array.isArray(value) ? value[0] : value
                  )
                }
              />
              <div className="mt-2 text-sm text-gray-600">
                ⭐ {filters.minRating}+
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Results per Search
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={filters.resultCount}
              onChange={(e) =>
                handleFilterChange("resultCount", parseInt(e.target.value))
              }
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800"
            />
          </div>
        </fieldset> */}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={addSearchString}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Add Search Term
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>
    </aside>
  );
};

export default SearchForm;
