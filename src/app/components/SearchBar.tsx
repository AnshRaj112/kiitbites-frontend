// "use client";

// import { useState, useEffect, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { IoMdSearch } from "react-icons/io";
// import styles from "./styles/Search.module.scss";
// import { color } from "framer-motion";
// import { FaSearch } from "react-icons/fa"; 
// import DishCard from "./DishCard";



// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// const SearchBar: React.FC = () => {
//   const [query, setQuery] = useState<string>("");
//   const [suggestions, setSuggestions] = useState<string[]>([]);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [popularFoods, setPopularFoods] = useState<{ _id: string; name: string; price: number; image: string; searchCount: number }[]>([]);
//   const [itemsToShow, setItemsToShow] = useState(12);

//   useEffect(() => {
//     // Lazy loading the search parameter
//     setQuery(searchParams.get("search") || "");
//   }, [searchParams]);

//   // Fetch suggestions from the backend
//   const fetchSuggestions = async (searchText: string) => {
//     if (searchText.length === 0) {
//       setSuggestions([]);
//       return;
//     }

//     try {
//       const res = await fetch(`${BACKEND_URL}/api/foods?query=${searchText}`);
//       const data = await res.json();
//       setSuggestions(data.map((item: { name: string }) => item.name));
//     } catch (error) {
//       console.error("Error fetching suggestions:", error);
//     }
//   };

//   //12 food
//   useEffect(() => {
//     const fetchPopularFoods = async () => {
//       try {
//         const res = await fetch(`${BACKEND_URL}/api/popular-foods`);
//         const data = await res.json();
//         setPopularFoods(data);
//       } catch (error) {
//         console.error("Error fetching popular foods:", error);
//       }
//     };
  
//     fetchPopularFoods();
//   }, []);

//   //6 food
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth <= 515) {
//         setItemsToShow(6);
//       } else {
//         setItemsToShow(12);
//       }
//     };
  
//     handleResize(); // Initial check
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Handle input change
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setQuery(value);
//     router.push(`?search=${value}`, undefined); // Update URL query
//     fetchSuggestions(value);
//   };

//   // Handle search selection
//   const handleSelectSuggestion = async (foodName: string) => {
//     setQuery(foodName);
//     router.push(`?search=${foodName}`, undefined);
//     setSuggestions([]);

//     try {
//       await fetch(`${BACKEND_URL}/api/increase-search`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ foodName }),
//       });
//     } catch (error) {
//       console.error("Error updating search count:", error);
//     }
//   };

//   const handleSelectSuggestion2 = async (item: { _id: string; name: string }) => {
//     setQuery(item.name);
//     setSuggestions([]);
  
//     try {
//       await fetch(`${BACKEND_URL}/api/increase-search`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ foodName: item.name }),
//       });
//     } catch (error) {
//       console.error("Error updating search count:", error);
//     }
  
//     router.push(`/item/${item._id}`); // Navigate to item detail page
//   };
  

//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <div className={styles.container}>
//         <div className={styles.inputC}>
//           <div className={styles.searchInputWrapper}>
//             <input
//               type="text"
//               value={query}
//               onChange={handleInputChange}
//               placeholder="Search for food...."
//               className={styles.searchInput}
//             />
//             <FaSearch className={styles.searchIcon} />
//           </div>
//         </div>
//         <div className={styles.optionsFood}>
//           {suggestions.length > 0 && (
//             <ul className={styles.options}>
//               {suggestions.map((food) => (
//                 <li
//                   key={food}
//                   className="p-2 hover:bg-gray-300 cursor-pointer"
//                   onClick={() => handleSelectSuggestion(food)}
//                 >
//                   {food}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//         <div className={styles.popularChoices}>
//           <h1>Popular Choices</h1>
//           <div className={styles.popularGrid}>
//             {popularFoods.slice(0, itemsToShow).map((food) => (
//               <div
//                 key={food.name}
//                 className={styles.foodCard}
//                 onClick={() => handleSelectSuggestion(food.name)}
//               >
//                 <h2 className="font-semibold">{food.name}</h2>
//                 <p className="text-sm text-gray-500">{food.price}</p>
//                 <p className="text-sm text-gray-500">Searched: {food.searchCount}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </Suspense>
//   );
// };

// export default SearchBar;

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import DishCard from "./DishCard";
import styles from "./styles/Search.module.scss";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [popularFoods, setPopularFoods] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [userUniversity, setUserUniversity] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  // Load universities
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/universities`);
        const data = await res.json();
        setUniversities(data);
      } catch (err) {
        console.error("Failed to load universities:", err);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/me`, {
          credentials: "include",
        });
        const user = await res.json();
        if (user?.uniID) {
          setUserUniversity(user.uniID);
          setSelectedUniversity(user.uniID);
        }
      } catch {
        // Not logged in
      }
    };

    fetchUniversities();
    fetchUser();
  }, []);

  // Load popular foods
  useEffect(() => {
    if (!selectedUniversity) return;
    const fetchPopularFoods = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/popular-foods?uniID=${selectedUniversity}`);
        const data = await res.json();
        setPopularFoods(data);
      } catch (error) {
        console.error("Error fetching popular foods:", error);
      }
    };

    fetchPopularFoods();
  }, [selectedUniversity]);

  // Search foods
  const fetchSearchResults = async (searchText: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/foods?query=${searchText}&uniID=${selectedUniversity}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    router.push(`?search=${value}`, undefined);
    setSuggestions([]);
    fetchSearchResults(value);
  };

  const handleSelectSuggestion = async (foodName: string) => {
    setQuery(foodName);
    router.push(`?search=${foodName}`, undefined);
    setSuggestions([]);
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
          <div style={{ width: "25%" }}>
            <select value={selectedUniversity} onChange={handleUniversityChange} className={styles.dropdown}>
              <option value="">Select University</option>
              {universities.map((uni) => (
                <option key={uni._id} value={uni._id}>
                  {uni.fullName}
                </option>
              ))}
            </select>
          </div>
          <div style={{ width: "75%" }}>
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
            <h1>Popular Choices</h1>
            <div className={styles.popularGrid}>
              {popularFoods.map((food) => (
                <div key={food._id} className={styles.foodCard} onClick={() => handleSelectSuggestion(food.name)}>
                  <h2 className="font-semibold">{food.name}</h2>
                  <p className="text-sm text-gray-500">₹{food.price}</p>
                  <p className="text-sm text-gray-500">From: {food.vendorId?.location} ({food.vendorId?.type})</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {query !== "" && (
          <div className={styles.searchResults}>
            <h2 className="text-xl font-bold mb-2">Search Results</h2>
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
                    From: {food.vendorId?.location} ({food.vendorId?.type})
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default SearchBar;
