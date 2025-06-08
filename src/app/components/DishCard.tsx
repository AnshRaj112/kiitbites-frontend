"use client";

import React from "react";
type Props = {
  dishName: string;
  price: number;
  image: string;
  variant?: "list" | "search-result";
};

const DishCard: React.FC<Props> = ({ dishName, price, image, variant = "list" }) => {
  const isSearch = variant === "search-result";

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${isSearch ? "flex" : "block"} w-full max-w-md`}>
      <img
        src={image}
        alt={dishName}
        className={isSearch ? "w-24 h-24 object-cover rounded mr-4" : "w-full h-32 object-cover rounded-lg"}
      />
      <div className="flex-1">
        <h3 className="text-lg font-bold mt-2">{dishName}</h3>
        <p className="text-gray-800 font-semibold">₹ {price}</p>
      </div>
    </div>
  );
};

export default DishCard;
