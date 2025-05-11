"use client";
import React, { forwardRef } from 'react';
import styles from './styles/FoodItems.module.scss';
const foodItems = [
  { name: 'Fried Rice', image: '/images/friedrice.jpg' },
  { name: 'Roll', image: '/images/roll.jpg' },
  { name: 'Chips', image: '/images/chips.jpg' },
  { name: 'Brownie', image: '/images/brownie.jpg' },
  { name: 'Pasta', image: '/images/pasta.jpg' },
  { name: 'Maggie', image: '/images/maggie.jpg' },
  { name: 'Coffee', image: '/images/coffee.jpeg' },
  { name: 'Noodles', image: '/images/noodles.jpeg' },
  { name: 'Drinks', image: '/images/drinks.jpg' },
  { name: 'Chocolate', image: '/images/chocolate.jpeg' },
  { name: 'Fried Rice', image: '/images/friedrice.jpg' },
  { name: 'Roll', image: '/images/roll.jpg' },
  { name: 'Chips', image: '/images/chips.jpg' },
  { name: 'Brownie', image: '/images/brownie.jpg' },
  { name: 'Pasta', image: '/images/pasta.jpg' },
  { name: 'Maggie', image: '/images/maggie.jpg' },
  { name: 'Coffee', image: '/images/coffee.jpeg' },
  { name: 'Noodles', image: '/images/noodles.jpeg' },
  { name: 'Drinks', image: '/images/drinks.jpg' },
  { name: 'Chocolate', image: '/images/chocolate.jpeg' },
  
];


interface FoodItemsProps {
  limit?: number;
  customClass?: string;
  layout?: 'grid' | 'scroll'; // <-- Add layout prop
}

const FoodItems = forwardRef<HTMLDivElement, FoodItemsProps>(
  ({ limit, customClass, layout = 'scroll' }, ref) => {
    const itemsToShow = limit ? foodItems.slice(0, limit) : foodItems;

    const layoutClass =
      layout === 'grid' ? styles.gridLayout : styles.scrollLayout;

    return (
      <div className={`${layoutClass} ${customClass ?? ''}`} ref={ref}>
        {itemsToShow.map((item, index) => (
          <div key={index} className={styles.foodItem}>
            <img src={item.image} alt={item.name} className={styles.foodImage} />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    );
  }
);


FoodItems.displayName = "FoodItems";
export default FoodItems;


