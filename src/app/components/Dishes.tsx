"use client"

import React, { useState } from "react";
const dishesData = require("../data/dishes.json");
const restaurantsData = require("../data/restaurants.json");

// Define TypeScript interfaces
interface Foodcourt {
  id: number;
}

interface Dish {
  id: number;
  name: string;
  image: string;
  foodcourts: Foodcourt[];
}

interface Restaurant {
  id: number;
  name: string;
}

const Dishes: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>(dishesData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {dishes.map((dish: Dish) => (
        <div key={dish.id} className="border p-4 rounded-lg shadow-lg">
          <img src={dish.image} alt={dish.name} className="w-full h-48 object-cover rounded-lg" />
          <h2 className="text-xl font-bold mt-2">{dish.name}</h2>
          <p className="text-gray-600">
            Available at:{" "}
            {dish.foodcourts.map((foodcourt: Foodcourt) => {
              const foodcourtData = restaurantsData.find((r: Restaurant) => r.id === foodcourt.id);
              return foodcourtData ? foodcourtData.name : "Unknown";
            }).join(", ")}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Dishes;
