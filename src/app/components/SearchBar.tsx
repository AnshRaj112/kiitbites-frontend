"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import DishCard from "./DishCard";
import styles from "./styles/Search.module.scss";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface University {
  _id: string;
  fullName: string;
}

interface FoodItem {
  _id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  isSpecial: string;
  source: string;
  vendorId?: {
    location?: string;
  };
}

interface Vendor {
  _id: string;
  name: string;
}

type SearchFoodItem = {
  _id: string;
  name: string;
  price: number;
  image: string;
  type: string;
  source: string;
  vendorLocation?: string;
  isTypeMatch?: boolean;
};

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [popularFoods, setPopularFoods] = useState<FoodItem[]>([]);
  const [searchResults, setSearchResults] = useState<SearchFoodItem[]>([]);
  const [vendorResults, setVendorResults] = useState<Vendor[]>([]);
  const [activeTab, setActiveTab] = useState<'items' | 'vendors'>('items');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  // Load universities and user data
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

    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${BACKEND_URL}/api/user/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        const user = await res.json();
        if (user?.uniID) {
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

  // Load popular foods
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
  
        const combined = [...retailData.items, ...produceData.items];
        setPopularFoods(combined.slice(0, 24));
      } catch (error) {
        console.error("Error fetching popular foods:", error);
      }
    };
  
    fetchPopularFoods();
  }, [selectedUniversity]);

  // Search foods and vendors
  const fetchSearchResults = async (searchText: string) => {
    if (!selectedUniversity) return;

    try {
      // First, try to find items that match the search text
      const [itemsRes, vendorsRes] = await Promise.all([
        fetch(`${BACKEND_URL}/items/search/items?query=${searchText}&uniID=${selectedUniversity}`),
        fetch(`${BACKEND_URL}/items/search/vendors?query=${searchText}&uniID=${selectedUniversity}`)
      ]);

      const [itemsData, vendorsData] = await Promise.all([
        itemsRes.json(),
        vendorsRes.json()
      ]);

      // If no exact matches found, try to find items by type
      if (!Array.isArray(itemsData) || itemsData.length === 0) {
        // Try to find items by type
        const typeRes = await fetch(`${BACKEND_URL}/items/search/items?query=${searchText}&uniID=${selectedUniversity}&searchByType=true`);
        const typeData = await typeRes.json();
        
        if (Array.isArray(typeData) && typeData.length > 0) {
          setSearchResults(typeData);
        } else {
          setSearchResults([]);
        }
      } else {
        setSearchResults(itemsData);
      }

      setVendorResults(Array.isArray(vendorsData) ? vendorsData : []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
      setVendorResults([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    router.push(`?search=${value}`, undefined);
    fetchSearchResults(value);
  };

  const handleSelectSuggestion = async (foodName: string) => {
    setQuery(foodName);
    router.push(`?search=${foodName}`, undefined);
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
          <div className={`${styles.selectBar} ${query !== "" ? styles.selectBarHidden : ""}`}>
            {selectedUniversity ? (
              <select
                value={selectedUniversity}
                onChange={handleUniversityChange}
                className={styles.dropdown}
              >
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

          <div className={`${styles.searchBar} ${query !== "" ? styles.searchBarFull : ""}`}>
            <div className={styles.searchInputWrapper}>
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search for food or vendors..."
                className={styles.searchInput}
              />
              <FaSearch className={styles.searchIcon} />
            </div>
          </div>
        </div>

        {query !== "" && (
          <div className={styles.searchTabs}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'items' ? styles.active : ''}`}
              onClick={() => setActiveTab('items')}
            >
              Items
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'vendors' ? styles.active : ''}`}
              onClick={() => setActiveTab('vendors')}
            >
              Vendors
            </button>
          </div>
        )}

        {query === "" ? (
          <div className={styles.popularChoices}>
            <h2 className="text-xl font-bold mb-2">Popular Choices</h2>
            <div className={styles.popularGrid}>
              {Array.isArray(popularFoods) && popularFoods.map((food) => (
                <div key={food._id} className={styles.foodCard} onClick={() => handleSelectSuggestion(food.name)}>
                  <DishCard
                    dishName={food.name}
                    price={food.price}
                    image={food.image}
                    variant="search-result"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.searchResults}>
            {activeTab === 'items' ? (
              <div className={styles.resultsGrid}>
                {Array.isArray(searchResults) && searchResults.map((item) => (
                  <div key={item._id} className={styles.resultCard}>
                    <DishCard
                      dishName={item.name}
                      price={item.price}
                      image={item.image}
                      variant="search-result"
                    />
                    <div className={styles.itemDetails}>
                      <p className="text-sm text-gray-600">Type: {item.type}</p>
                      <p className="text-xs text-gray-500">Source: {item.source}</p>
                      {item.isTypeMatch && (
                        <p className="text-xs text-blue-500 mt-1">Similar item type</p>
                      )}
                    </div>
                  </div>
                ))}
                {(!Array.isArray(searchResults) || searchResults.length === 0) && (
                  <p className={styles.noResults}>No items found</p>
                )}
              </div>
            ) : (
              <div className={styles.vendorResults}>
                {Array.isArray(vendorResults) && vendorResults.map((vendor) => (
                  <div key={vendor._id} className={styles.vendorCard}>
                    <h3 className="font-semibold">{vendor.name}</h3>
                  </div>
                ))}
                {(!Array.isArray(vendorResults) || vendorResults.length === 0) && (
                  <p className={styles.noResults}>No vendors found</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default SearchBar;
