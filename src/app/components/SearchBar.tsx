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
  vendorId?: {
    location?: string;
  };
}

interface VendorItem {
  itemId: string;
  name: string;
  price: number;
  image?: string;
  type?: string;
  quantity?: number;
  isAvailable?: string;
  _id?: string;
}

interface VendorData {
  success: boolean;
  foodCourtName: string;
  message?: string;
  data: {
    retailItems: VendorItem[];
    produceItems: VendorItem[];
  };
}

interface SearchResult {
  _id: string;
  name: string;
  price?: number;
  image?: string;
  type?: string;
  source?: string;
  isTypeMatch?: boolean;
  isVendor?: boolean;
}

interface SearchResponse {
  message?: string;
  youMayAlsoLike?: SearchResult[];
}

interface SearchBarProps {
  hideUniversityDropdown?: boolean;
  placeholder?: string;
  vendorId?: string;
  universityId?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  hideUniversityDropdown = false,
  placeholder = "Search for food or vendors...",
  vendorId,
  universityId
}) => {
  const [query, setQuery] = useState<string>("");
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [popularFoods, setPopularFoods] = useState<FoodItem[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [suggestedItems, setSuggestedItems] = useState<SearchResult[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (universityId) {
      setSelectedUniversity(universityId);
    }
  }, [universityId]);

  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [searchParams]);

  // Load universities and user data
  useEffect(() => {
    if (hideUniversityDropdown) return;

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
  }, [hideUniversityDropdown]);

  // Load popular foods
  useEffect(() => {
    if (!selectedUniversity || hideUniversityDropdown) return;
  
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
  }, [selectedUniversity, hideUniversityDropdown]);

  // Search foods and vendors
  const fetchSearchResults = async (searchText: string) => {
    if (!selectedUniversity && !hideUniversityDropdown) return;

    try {
      if (vendorId) {
        // If we're in a vendor page, search only within this vendor's items
        const response = await fetch(`${BACKEND_URL}/items/getvendors/${vendorId}`);
        
        // First check if response is ok
        if (!response.ok) {
          console.error("Vendor search failed:", response.status);
          setSearchResults([]);
          setSuggestedItems([]);
          return;
        }

        // Try to parse the response as JSON
        let data: VendorData;
        try {
          data = await response.json();
        } catch (e) {
          console.error("Failed to parse vendor data:", e);
          setSearchResults([]);
          setSuggestedItems([]);
          return;
        }
        
        if (!data.success) {
          console.error("Vendor data fetch failed:", data.message);
          setSearchResults([]);
          setSuggestedItems([]);
          return;
        }

        const allVendorItems = [
          ...(data.data.retailItems || []).map((item: VendorItem) => ({
            ...item,
            type: 'retail',
            itemId: item.itemId || item._id
          })),
          ...(data.data.produceItems || []).map((item: VendorItem) => ({
            ...item,
            type: 'produce',
            itemId: item.itemId || item._id
          }))
        ];

        // If search text is empty, show all items
        if (!searchText.trim()) {
          setSearchResults(allVendorItems.map(item => ({
            _id: item.itemId || item._id || `temp-${Math.random()}`,
            name: item.name,
            price: item.price,
            image: item.image || '/images/coffee.jpeg',
            type: item.type
          })));
          setSuggestedItems([]);
          return;
        }

        // Filter items based on search query
        const searchLower = searchText.toLowerCase();
        const exactMatches = allVendorItems.filter(item => 
          item.name.toLowerCase().includes(searchLower)
        );

        // Get items of the same type as matches for suggestions
        const matchedTypes = new Set(exactMatches.map(item => item.type));
        const suggestions = allVendorItems.filter(item => 
          matchedTypes.has(item.type) && !exactMatches.some(match => match.itemId === item.itemId)
        );

        setSearchResults(exactMatches.map(item => ({
          _id: item.itemId || item._id || `temp-${Math.random()}`,
          name: item.name,
          price: item.price,
          image: item.image || '/images/coffee.jpeg',
          type: item.type
        })));

        setSuggestedItems(suggestions.map(item => ({
          _id: item.itemId || item._id || `temp-${Math.random()}`,
          name: item.name,
          price: item.price,
          image: item.image || '/images/coffee.jpeg',
          type: item.type
        })));
      } else {
        // Normal search (both items and vendors)
        const [itemsRes, vendorsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/items/search/items?query=${searchText}&uniID=${selectedUniversity}&searchByType=true`),
          fetch(`${BACKEND_URL}/items/search/vendors?query=${searchText}&uniID=${selectedUniversity}`)
        ]);

        if (!itemsRes.ok || !vendorsRes.ok) {
          throw new Error(`HTTP error! status: ${itemsRes.status} ${vendorsRes.status}`);
        }

        const [itemsData, vendorsData] = await Promise.all([
          itemsRes.json(),
          vendorsRes.json()
        ]);

        let items: SearchResult[] = [];
        let suggestions: SearchResult[] = [];

        if ('message' in itemsData && itemsData.youMayAlsoLike) {
          suggestions = (itemsData as SearchResponse).youMayAlsoLike || [];
        } else if (Array.isArray(itemsData)) {
          items = itemsData.filter(item => !item.isTypeMatch);
          suggestions = itemsData.filter(item => item.isTypeMatch);
        }

        const vendors = Array.isArray(vendorsData) ? vendorsData.map(vendor => ({
          ...vendor,
          isVendor: true
        })) : [];

        setSearchResults([...items, ...vendors]);
        setSuggestedItems(suggestions);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
      setSuggestedItems([]);
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

  const handleVendorClick = (vendorId: string) => {
    router.push(`/vendor/${vendorId}`);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={styles.container}>
        <div className={styles.header}>
          {!hideUniversityDropdown && (
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
          )}

          <div className={`${styles.searchBar} ${query !== "" ? styles.searchBarFull : ""}`}>
            <div className={styles.searchInputWrapper}>
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder={placeholder}
                className={styles.searchInput}
              />
              <FaSearch className={styles.searchIcon} />
            </div>
          </div>
        </div>

        {query === "" && !hideUniversityDropdown ? (
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
            {searchResults.length > 0 && (
              <div className={styles.resultsGrid}>
                {searchResults.map((item) => (
                  <div 
                    key={item._id} 
                    className={styles.resultCard}
                    onClick={() => item.isVendor ? handleVendorClick(item._id) : handleSelectSuggestion(item.name)}
                  >
                    {item.isVendor ? (
                      <div className={styles.vendorCard}>
                        <h3 className="font-semibold">{item.name}</h3>
                      </div>
                    ) : (
                      <DishCard
                        dishName={item.name}
                        price={item.price || 0}
                        image={item.image || '/images/coffee.jpeg'}
                        variant="search-result"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {suggestedItems.length > 0 && (
              <div className={styles.suggestedItems}>
                <h2 className="text-xl font-bold mb-4">You may also like</h2>
                <div className={styles.resultsGrid}>
                  {suggestedItems.map((item) => (
                    <div 
                      key={item._id} 
                      className={styles.resultCard}
                      onClick={() => handleSelectSuggestion(item.name)}
                    >
                      <DishCard
                        dishName={item.name}
                        price={item.price || 0}
                        image={item.image || '/images/coffee.jpeg'}
                        variant="search-result"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {query !== "" && searchResults.length === 0 && suggestedItems.length === 0 && (
              <div className={styles.noResults}>
                <p>No results found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default SearchBar;
