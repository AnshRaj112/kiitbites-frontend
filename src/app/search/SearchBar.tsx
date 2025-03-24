"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./styles/Search.module.scss";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Lazy loading the search parameter
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  // Fetch suggestions from the backend
  const fetchSuggestions = async (searchText: string) => {
    if (searchText.length === 0) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/foods?query=${searchText}`);
      const data = await res.json();
      setSuggestions(data.map((item: { name: string }) => item.name));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    router.push(`?search=${value}`, undefined); // Update URL query
    fetchSuggestions(value);
  };

  // Handle search selection
  const handleSelectSuggestion = async (foodName: string) => {
    setQuery(foodName);
    router.push(`?search=${foodName}`, undefined);
    setSuggestions([]);

    try {
      await fetch(`${BACKEND_URL}/api/increase-search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodName }),
      });
    } catch (error) {
      console.error("Error updating search count:", error);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={styles.container}>
        <div className="relative w-full max-w-md mx-auto">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for food..."
            className="w-full p-2 border border-gray-300 rounded"
          />
          {suggestions.length > 0 && (
            <ul className="absolute left-0 w-full bg-white border border-gray-300 rounded shadow-md">
              {suggestions.map((food) => (
                <li
                  key={food}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectSuggestion(food)}
                >
                  {food}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default SearchBar;
