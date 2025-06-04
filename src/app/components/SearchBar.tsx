"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import DishCard from "./DishCard";
import styles from "./styles/Search.module.scss";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  // const [suggestions, setSuggestions] = useState<string[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [popularFoods, setPopularFoods] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  // const [userUniversity, setUserUniversity] = useState<string | null>(null);
  // const [isUserLoaded, setIsUserLoaded] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);


  // Load universities
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/user/auth/list`);
        const data = await res.json();
        setUniversities(data);
      } catch (err) {
        console.error("Failed to load universities:", err);
      }
    };

    // const fetchUser = async () => {
    //   try {
    //     const res = await fetch('${', {
    //       credentials: "include",
    //     });
    //     const user = await res.json();
    //     if (user?.uniID) {
    //       setUserUniversity(user.uniID);
    //       setSelectedUniversity(user.uniID);
    //     }
    //   } finally {
    //     setIsUserLoaded(true);
    //   }
    // };
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${BACKEND_URL}/api/user/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        const user = await res.json();
        console.log("Fetched user:", user); // ✅ DEBUG LOG
    
        if (user?.uniID) {
          // setUserUniversity(user.uniID);
          setSelectedUniversity(user.uniID);
        } else {
          console.warn("No uniID found in user object");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    

    fetchUniversities();
    fetchUser();
  }, []);

  useEffect(() => {
    console.log("Selected University:", selectedUniversity);
  }, [selectedUniversity]);
  

  // Load popular foods
  // useEffect(() => {
  //   if (!selectedUniversity) return;
  //   const fetchPopularFoods = async () => {
  //     try {
  //       const res = await fetch(`${BACKEND_URL}/items/popular-foods?uniID=${selectedUniversity}`);
  //       const data = await res.json();
  //       setPopularFoods(data);
  //     } catch (error) {
  //       console.error("Error fetching popular foods:", error);
  //     }
  //   };

  //   fetchPopularFoods();
  // }, [selectedUniversity]);

//popularfood
  useEffect(() => {
    if (!selectedUniversity) return;
  
    const fetchPopularFoods = async () => {
      try {
        const [retailRes, produceRes] = await Promise.all([
          fetch(`${BACKEND_URL}/items/retail/uni/${selectedUniversity}`),
          fetch(`${BACKEND_URL}/items/produce/uni/${selectedUniversity}`),
        ]);
  
        const [retailData, produceData] = await Promise.all([
          retailRes.json(),
          produceRes.json(),
        ]);
  
        // You can optionally sort or filter here
        const combined = [...retailData.items, ...produceData.items];
  
        // Limit to top 10 or whatever
        setPopularFoods(combined.slice(0, 24));
      } catch (error) {
        console.error("Error fetching popular foods:", error);
      }
    };
  
    fetchPopularFoods();
  }, [selectedUniversity]);
  

  // Search foods
  const fetchSearchResults = async (searchText: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/items/foods?query=${searchText}&uniID=${selectedUniversity}`);
      const data = await res.json();
      setSearchResults(data);
      console.log(data)
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    router.push(`?search=${value}`, undefined);
    // setSuggestions([]);
    fetchSearchResults(value);
  };

  const handleSelectSuggestion = async (foodName: string) => {
    setQuery(foodName);
    router.push(`?search=${foodName}`, undefined);
    // setSuggestions([]);
    fetchSearchResults(foodName);

    await fetch(`${BACKEND_URL}/api/increase-search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ foodName }),
    });
  };

  const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUniversity(e.target.value);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={styles.container}>
      <div className={styles.header}>
        <div
          className={`${styles.selectBar} ${
            query !== "" ? styles.selectBarHidden : ""
          }`}
        >
          {selectedUniversity ? (
            <select
              value={selectedUniversity}
              onChange={handleUniversityChange}
              className={styles.dropdown}
            >
              <option value="">Select University</option>
              {universities.map((uni) => (
                <option key={uni._id} value={uni._id}>
                  {uni.fullName}
                </option>
              ))}
            </select>
          ) : (
            <select disabled className={styles.dropdown}>
              <option>Loading Universities...</option>
            </select>
          )}
        </div>

        <div
          className={`${styles.searchBar} ${query !== "" ? styles.searchBarFull : ""}`}
        >
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search for food..."
              className={styles.searchInput}
            />
            <FaSearch className={styles.searchIcon} />
          </div>
        </div>
      </div>



        {query === "" && (
          <div className={styles.popularChoices}>
            {/* <h1>Popular Choices</h1> */}
            <h2 className="text-xl font-bold mb-2">Popular Choices</h2>
            <div className={styles.popularGrid}>
              {popularFoods.map((food) => (
                <div key={food._id} className={styles.foodCard} onClick={() => handleSelectSuggestion(food.name)}>
                  <h2 className="font-semibold">{food.name}</h2>
                  <p className="text-sm text-gray-500">₹{food.price}</p>
                  <p className="text-sm text-gray-500">From: {food.vendorId?.location||"Unknown Location"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {query !== "" && (
          <div className={styles.searchResults}>
            <h2 className="text-xl font-bold mb-2">Search Results</h2>
            {Array.isArray(searchResults) && searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((food) => (
                  <div key={food._id}>
                    <DishCard
                      dishName={food.name}
                      price={food.price}
                      image={food.image}
                      variant="search-result"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      From: {food.vendorLocation || "Unknown"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No results found.</p>
            )}
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default SearchBar;
