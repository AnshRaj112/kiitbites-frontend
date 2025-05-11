"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./styles/Search.module.scss";
import { color } from "framer-motion";
import { FaSearch } from "react-icons/fa"; 



const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [popularFoods, setPopularFoods] = useState<{ name: string; searchCount: number; description: string }[]>([]);
  const [itemsToShow, setItemsToShow] = useState(12);

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

  //12 food
  useEffect(() => {
    const fetchPopularFoods = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/popular-foods`);
        const data = await res.json();
        setPopularFoods(data);
      } catch (error) {
        console.error("Error fetching popular foods:", error);
      }
    };
  
    fetchPopularFoods();
  }, []);

  //6 food
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 515) {
        setItemsToShow(6);
      } else {
        setItemsToShow(12);
      }
    };
  
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        <div className={styles.inputC}>
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search for food...."
              className={styles.searchInput}
            />
            <FaSearch className={styles.searchIcon} />
          </div>
        </div>
        <div className={styles.optionsFood}>
          {suggestions.length > 0 && (
            <ul className={styles.options}>
              {suggestions.map((food) => (
                <li
                  key={food}
                  className="p-2 hover:bg-gray-300 cursor-pointer"
                  onClick={() => handleSelectSuggestion(food)}
                >
                  {food}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.popularChoices}>
          <h1>Popular Choices</h1>
          <div className={styles.popularGrid}>
            {popularFoods.slice(0, itemsToShow).map((food) => (
              <div
                key={food.name}
                className={styles.foodCard}
                onClick={() => handleSelectSuggestion(food.name)}
              >
                <h2 className="font-semibold">{food.name}</h2>
                <p className="text-sm text-gray-500">{food.description}</p>
                <p className="text-sm text-gray-500">Searched: {food.searchCount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default SearchBar;
