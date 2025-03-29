"use client"

import React, { useState } from "react";
const restaurantsData = require("../data/restaurants.json");


// Define the restaurant type
interface Restaurant {
  id: number;
  name: string;
  location: string;
  image: string;
}

const RestaurantComponent: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(restaurantsData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {restaurants.map((restaurant: Restaurant) => (
        <div key={restaurant.id} className="border p-4 rounded-lg shadow-lg">
          <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover rounded-lg" />
          <h2 className="text-xl font-bold mt-2">{restaurant.name}</h2>
          <p className="text-gray-600">{restaurant.location}</p>
        </div>
      ))}
    </div>
  );
};

export default RestaurantComponent;
