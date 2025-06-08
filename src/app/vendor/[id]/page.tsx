"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DishCard from "@/app/components/DishCard";
import SearchBar from "@/app/components/SearchBar";
import styles from "./styles/VendorPage.module.scss";
import { addToCart, increaseQuantity, decreaseQuantity } from "./utils/cartUtils";
import { toast } from "react-toastify";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface VendorItem {
  itemId: string;
  name: string;
  type?: string;
  price: number;
  image?: string;
  quantity?: number;
  isAvailable?: string;
}

interface VendorData {
  success: boolean;
  foodCourtName: string;
  data: {
    retailItems: VendorItem[];
    produceItems: VendorItem[];
  };
  uniID?: string;
}

interface UserData {
  _id: string;
  cart: Array<{
    itemId: string;
    kind: string;
    quantity: number;
  }>;
}

const VendorPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [universityId, setUniversityId] = useState<string>("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<VendorItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch vendor data
        const vendorResponse = await fetch(`${BACKEND_URL}/items/getvendors/${id}`);
        const vendorData = await vendorResponse.json();
        if (vendorData.success) {
          // Add type information to items
          const retailItems = vendorData.data.retailItems.map((item: VendorItem) => ({
            ...item,
            type: "retail"
          }));
          const produceItems = vendorData.data.produceItems.map((item: VendorItem) => ({
            ...item,
            type: "produce"
          }));
          
          setVendorData({
            ...vendorData,
            data: {
              retailItems,
              produceItems
            }
          });
          
          if (vendorData.uniID) {
            setUniversityId(vendorData.uniID);
          }
        }

        // Fetch user data
        const token = localStorage.getItem("token");
        if (token) {
          const userResponse = await fetch(`${BACKEND_URL}/api/user/auth/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUserData(userData);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const allItems = [
    ...(vendorData?.data.retailItems || []),
    ...(vendorData?.data.produceItems || [])
  ];

  const filteredItems = searchResults.length > 0 ? searchResults : allItems.filter(item => {
    const matchesType = !selectedType || item.type === selectedType;
    return matchesType;
  });

  const uniqueTypes = Array.from(
    new Set(
      allItems
        .map(item => item.type)
        .filter((type): type is string => Boolean(type))
    )
  );

  const getItemQuantity = (itemId: string, type?: string) => {
    if (!userData?.cart) return 0;
    const kind = type === "retail" ? "Retail" : "Produce";
    const cartItem = userData.cart.find(
      item => item.itemId === itemId && item.kind === kind
    );
    return cartItem?.quantity || 0;
  };

  const handleAddToCart = async (item: VendorItem) => {
    if (!userData) {
      toast.error("Please login to add items to cart");
      return;
    }

    const quantity = getItemQuantity(item.itemId, item.type);
    if (quantity === 0) {
      await addToCart(userData._id, item, id as string);
    } else {
      await increaseQuantity(userData._id, item, id as string);
    }

    // Refresh user data to update cart
    const token = localStorage.getItem("token");
    if (token) {
      const userResponse = await fetch(`${BACKEND_URL}/api/user/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (userResponse.ok) {
        const updatedUserData = await userResponse.json();
        setUserData(updatedUserData);
      }
    }
  };

  const handleDecreaseQuantity = async (item: VendorItem) => {
    if (!userData) return;
    await decreaseQuantity(userData._id, item, id as string);

    // Refresh user data to update cart
    const token = localStorage.getItem("token");
    if (token) {
      const userResponse = await fetch(`${BACKEND_URL}/api/user/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (userResponse.ok) {
        const updatedUserData = await userResponse.json();
        setUserData(updatedUserData);
      }
    }
  };

  const handleItemClick = async (item: VendorItem) => {
    try {
      // Log the search in the backend
      await fetch(`${BACKEND_URL}/api/increase-search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodName: item.name }),
      });

      // Navigate to the item details page
      router.push(`/item/${item.itemId}`);
    } catch (error) {
      console.error("Error handling item click:", error);
    }
  };

  const handleSearch = (results: VendorItem[]) => {
    setIsSearching(true);
    setSearchResults(results);
  };

  const handleClearSearch = () => {
    setIsSearching(false);
    setSearchResults([]);
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.vendorName}>{vendorData?.foodCourtName}</h1>
        <div className={styles.searchContainer}>
          <SearchBar 
            hideUniversityDropdown={true} 
            placeholder="Search food items..." 
            vendorId={id as string}
            universityId={universityId}
            onSearchResults={handleSearch}
          />
          {isSearching && (
            <button 
              className={styles.clearSearchButton}
              onClick={handleClearSearch}
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {uniqueTypes.length > 0 && !isSearching && (
        <div className={styles.typeFilters}>
          <button
            className={`${styles.typeButton} ${!selectedType ? styles.active : ''}`}
            onClick={() => setSelectedType(null)}
          >
            All
          </button>
          {uniqueTypes.map(type => (
            <button
              key={type}
              className={`${styles.typeButton} ${selectedType === type ? styles.active : ''}`}
              onClick={() => setSelectedType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      )}

      <div className={styles.itemsGrid}>
        {filteredItems.length === 0 ? (
          <div className={styles.noResults}>
            {isSearching ? "No items found matching your search" : "No items available"}
          </div>
        ) : (
          filteredItems.map(item => {
            const quantity = getItemQuantity(item.itemId, item.type);
            return (
              <div 
                key={item.itemId} 
                className={styles.itemCard}
              >
                <div onClick={() => handleItemClick(item)} style={{ cursor: 'pointer' }}>
                  <DishCard
                    dishName={item.name}
                    price={item.price}
                    image={item.image || '/images/coffee.jpeg'}
                    variant="search-result"
                  />
                  {item.quantity !== undefined && (
                    <p className={styles.quantity}>Available: {item.quantity}</p>
                  )}
                  {item.isAvailable && (
                    <p className={`${styles.availability} ${item.isAvailable === "Y" ? styles.available : styles.unavailable}`}>
                      {item.isAvailable === "Y" ? "Available" : "Not Available"}
                    </p>
                  )}
                </div>
                <div className={styles.cartControls}>
                  {quantity > 0 ? (
                    <>
                      <button 
                        className={styles.quantityButton}
                        onClick={() => handleDecreaseQuantity(item)}
                      >
                        -
                      </button>
                      <span className={styles.quantity}>{quantity}</span>
                      <button 
                        className={styles.quantityButton}
                        onClick={() => handleAddToCart(item)}
                      >
                        +
                      </button>
                    </>
                  ) : (
                    <button 
                      className={styles.addToCartButton}
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default VendorPage; 