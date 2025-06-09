"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DishCard from "./DishCard";
import styles from "./styles/Search.module.scss";
import { useSearchCart } from './context/SearchCartContext';
import SearchQuantityControls from './SearchQuantityControls';

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

export interface SearchResult {
  _id?: string;
  id: string;
  itemId?: string;
  name: string;
  title: string;
  price: number;
  image: string;
  type: string;
  category: string;
  isSpecial: boolean;
  vendorId?: string;
  isVendor?: boolean;
  kind: string;
  quantity: number;
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
  onSearchResults?: (results: VendorItem[]) => void;
}

interface Vendor {
  _id: string;
  name: string;
  price: number;
  inventoryValue?: {
    price: number;
    quantity?: number;
    isAvailable?: string;
  };
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  hideUniversityDropdown = false,
  placeholder = "Search for food or vendors...",
  vendorId,
  universityId,
  onSearchResults
}) => {
  const [query, setQuery] = useState<string>("");
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");
  const [popularFoods, setPopularFoods] = useState<FoodItem[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [suggestedItems, setSuggestedItems] = useState<SearchResult[]>([]);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [availableVendors, setAvailableVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { searchCartItems, addToSearchCart } = useSearchCart();
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);

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
          if (onSearchResults) onSearchResults([]);
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
          if (onSearchResults) onSearchResults([]);
          return;
        }
        
        if (!data.success) {
          console.error("Vendor data fetch failed:", data.message);
          setSearchResults([]);
          setSuggestedItems([]);
          if (onSearchResults) onSearchResults([]);
          return;
        }

        const allVendorItems = [
          ...(data.data.retailItems || []).map((item: VendorItem) => ({
            ...item,
            type: 'retail',
            itemId: item.itemId || item._id || ''
          })),
          ...(data.data.produceItems || []).map((item: VendorItem) => ({
            ...item,
            type: 'produce',
            itemId: item.itemId || item._id || ''
          }))
        ].filter(item => item.itemId); // Filter out items without an ID

        // If search text is empty, show all items
        if (!searchText.trim()) {
          const results = allVendorItems
            .map(item => ({
              id: item.itemId,
              name: item.name,
              title: item.name,
              price: item.price || 0,
              image: item.image || '/images/coffee.jpeg',
              type: item.type || 'retail',
              category: item.type || 'retail',
              isSpecial: false,
              isVendor: false,
              kind: item.type === 'retail' ? 'Retail' : 'Produce',
              quantity: 1,
              vendorId: vendorId
            }));
          setSearchResults(results);
          setSuggestedItems([]);
          if (onSearchResults) onSearchResults(allVendorItems);
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

        const results = exactMatches
          .map(item => ({
            id: item.itemId,
            name: item.name,
            title: item.name,
            price: item.price || 0,
            image: item.image || '/images/coffee.jpeg',
            type: item.type || 'retail',
            category: item.type || 'retail',
            isSpecial: false,
            isVendor: false,
            kind: item.type === 'retail' ? 'Retail' : 'Produce',
            quantity: 1,
            vendorId: vendorId
          }));
        setSearchResults(results);

        const suggestedResults = suggestions
          .map(item => ({
            id: item.itemId,
            name: item.name,
            title: item.name,
            price: item.price || 0,
            image: item.image || '/images/coffee.jpeg',
            type: item.type || 'retail',
            category: item.type || 'retail',
            isSpecial: false,
            isVendor: false,
            kind: item.type === 'retail' ? 'Retail' : 'Produce',
            quantity: 1,
            vendorId: vendorId
          }));
        setSuggestedItems(suggestedResults);
        
        // Call the callback with the filtered vendor items
        if (onSearchResults) onSearchResults(exactMatches);
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
      if (onSearchResults) onSearchResults([]);
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

  const handleAddToCart = async (item: SearchResult) => {
    setSelectedItem(item);
    console.log('Selected item:', item);

    const itemId = item._id;
    if (!itemId) {
      console.error('Item missing ID:', item);
      toast.error('Invalid item ID');
      return;
    }

    console.log('Using item ID:', itemId);
    try {
      // First show the modal
      setShowVendorModal(true);
      setSelectedVendor(null);
      
      // Then fetch vendors
      const response = await fetch(`${BACKEND_URL}/items/vendors/${itemId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const vendors = await response.json();
      console.log('Received vendors:', vendors);
      
      if (!Array.isArray(vendors) || vendors.length === 0) {
        console.log('No vendors available');
        toast.error('No vendors available for this item');
        setShowVendorModal(false);
        return;
      }
      
      console.log('Setting available vendors:', vendors);
      setAvailableVendors(vendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to fetch vendors');
      setShowVendorModal(false);
    }
  };

  const handleVendorSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);
  };

  const handleVendorConfirm = async () => {
    if (!selectedVendor || !selectedItem) {
      toast.error('Please select a vendor and item');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error('Please login to add items to cart');
        return;
      }

      const response = await fetch(`${BACKEND_URL}/api/user/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        toast.error('Failed to get user info');
        return;
      }
      const user = await response.json();
      
      if (!user._id) {
        toast.error('Invalid user data');
        return;
      }

      if (!selectedItem._id && !selectedItem.id) {
        toast.error('Invalid item data');
        return;
      }

      console.log('Adding to cart:', {
        user: user._id,
        item: selectedItem,
        vendor: selectedVendor._id
      });

      // Add to cart with all required parameters
      await addToSearchCart(
        user._id,
        selectedItem,
        selectedVendor._id
      );
      setShowVendorModal(false);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add item to cart');
    }
  };

  const handleCancel = () => {
    setShowVendorModal(false);
    setSelectedVendor(null);
    setAvailableVendors([]);
  };

  // Find cart item and its quantity
  const getCartItemQuantity = (itemId: string) => {
    const cartItem = searchCartItems.find(item => item.id === itemId);
    return cartItem?.quantity || 0;
  };

  const handleClearSearch = () => {
    setQuery("");
    setSearchResults([]);
    setSuggestedItems([]);
    router.push("?", undefined);
    if (onSearchResults) onSearchResults([]);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className={styles.mainContainer}>
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
              <div className={styles.searchInputContainer}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  placeholder={placeholder}
                  className={styles.searchInput}
                />
                {query && (
                  <button 
                    className={styles.clearButton}
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
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
                  {searchResults.map((item) => {
                    const quantity = getCartItemQuantity(item._id || item.id);
                    const cartItem = searchCartItems.find(
                      (cartItem) => cartItem.id === (item._id || item.id)
                    );

                    return (
                      <div 
                        key={item._id} 
                        className={styles.resultCard}
                        onClick={() => item.isVendor && item._id ? handleVendorClick(item._id) : null}
                      >
                        {item.isVendor ? (
                          <div className={styles.vendorCard}>
                            <h3 className="font-semibold">{item.name}</h3>
                          </div>
                        ) : (
                          <div className={styles.foodCard}>
                            <DishCard
                              dishName={item.name}
                              price={item.price || 0}
                              image={item.image || '/images/coffee.jpeg'}
                              variant="search-result"
                            />
                            <SearchQuantityControls
                              item={{
                                id: item._id || item.id,
                                name: item.name,
                                type: item.type,
                                vendorId: cartItem?.vendorId
                              }}
                              quantity={quantity}
                              onAddToCart={() => handleAddToCart(item)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
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
      </div>

        {showVendorModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2 className="text-xl font-bold mb-4">Select Vendor</h2>
              {availableVendors.length === 0 ? (
                <div className="text-center py-4">Loading vendors...</div>
              ) : (
                <div className={styles.vendorList}>
                  {availableVendors.map((vendor) => (
                    <div
                      key={vendor._id}
                      className={`${styles.vendorItem} ${
                        selectedVendor?._id === vendor._id ? styles.selected : ""
                      }`}
                      onClick={() => handleVendorSelect(vendor)}
                    >
                      <h3 className="font-semibold">{vendor.name}</h3>
                      <p className="text-gray-600">₹{vendor.price}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className={styles.modalButtons}>
                <button 
                  className={`${styles.cancelButton} px-4 py-2 border rounded-md mr-2`} 
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className={`${styles.confirmButton} px-4 py-2 bg-blue-500 text-white rounded-md ${
                    !selectedVendor ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={handleVendorConfirm}
                  disabled={!selectedVendor}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
      )}
    </Suspense>
  );
};

export default SearchBar;