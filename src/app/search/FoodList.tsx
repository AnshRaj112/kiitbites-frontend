"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const FoodList: React.FC = () => {
  const [foods, setFoods] = useState<{ name: string; searchCount: number }[]>([]);
  const searchParams = useSearchParams();
  const query = searchParams.get("search") || "";

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/foods?query=${query}`);
        const data = await res.json();

        // Get search priority from localStorage
        const storedCounts = JSON.parse(localStorage.getItem("searchCounts") || "{}");

        // Sort based on previous search count (most searched first)
        const sortedFoods = data.sort(
          (a: any, b: any) => (storedCounts[b.name] || 0) - (storedCounts[a.name] || 0)
        );

        setFoods(sortedFoods);
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    };

    fetchFoods();
  }, [query]);

  return (
    <div>
      <h2>Search Results for "{query}"</h2>
      <ul>
        {foods.length > 0 ? (
          foods.map((food) => <li key={food.name}>{food.name}</li>)
        ) : (
          <p>No results found.</p>
        )}
      </ul>
    </div>
  );
};

export default FoodList;
