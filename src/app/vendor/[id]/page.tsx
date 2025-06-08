"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DishCard from "@/app/components/DishCard";
import SearchBar from "@/app/components/SearchBar";
import styles from "./styles/VendorPage.module.scss";

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

const VendorPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [universityId, setUniversityId] = useState<string>("");

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/items/getvendors/${id}`);
        const data = await response.json();
        if (data.success) {
          setVendorData(data);
          // The university ID should be available in the vendor data
          if (data.uniID) {
            setUniversityId(data.uniID);
          }
        }
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchVendorData();
  }, [id]);

  const allItems = [
    ...(vendorData?.data.retailItems || []),
    ...(vendorData?.data.produceItems || [])
  ];

  const filteredItems = allItems.filter(item => {
    const matchesType = !selectedType || item.type === selectedType;
    return matchesType;
  });

  // Get unique types, filtering out undefined and empty strings
  const uniqueTypes = Array.from(
    new Set(
      allItems
        .map(item => item.type)
        .filter((type): type is string => Boolean(type))
    )
  );

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
          />
        </div>
      </div>

      {uniqueTypes.length > 0 && (
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
        {filteredItems.map(item => (
          <div 
            key={item.itemId} 
            className={styles.itemCard}
            onClick={() => handleItemClick(item)}
            style={{ cursor: 'pointer' }}
          >
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
        ))}
      </div>
    </div>
  );
};

export default VendorPage; 