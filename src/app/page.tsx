import RestaurantCard from "./components/RestaurantCard";
import DishCard from "./components/DishCard";

const Demo = () => {
  return (
    <div className="p-6 space-y-10">
      {/* LANDING VARIANT */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Landing Page Variant</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <RestaurantCard
            variant="landing"
            restaurantName="Punjab Grill"
            restaurantImage="https://via.placeholder.com/300"
            rating={4.5}
            priceForTwo="₹2000 for two"
            location="Rasulgarh, Bhubaneswar"
            cuisine="North Indian"
            distance="4.7 km"
          />
          <RestaurantCard
            variant="landing"
            restaurantName="Bocca Cafe"
            restaurantImage="https://via.placeholder.com/300"
            rating={4.3}
            priceForTwo="₹800 for two"
            location="Kharvela Nagar, Bhubaneswar"
            cuisine="Beverages • Desserts"
            distance="2.1 km"
          />
        </div>
      </div>

      {/* HIGHLIGHT VARIANT */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Highlight Variant</h1>
        <RestaurantCard
          variant="highlight"
          restaurantName="Food Court"
          restaurantImage="https://via.placeholder.com/300"
          rating={4.2}
          priceForTwo="₹250 for two"
          location="Master Canteen"
          cuisine="Indian, Tandoor"
          distance="3.5 km"
        />
      </div>

      {/* SEARCH VARIANT */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Search Variant</h1>
        <RestaurantCard
          variant="default"
          restaurantName="Maggie Point"
          restaurantImage="https://via.placeholder.com/300"
          rating={4.0}
          priceForTwo="₹200 for two"
          location="CRP, Bhubaneswar"
          cuisine="Snacks, Beverages"
          distance="2.1 km"
          description="Tasty and budget-friendly Maggie dishes."
        />
      </div>

      {/* Dish Cards */}
      <div>
        <h2 className="text-xl font-bold mt-10">Dish (List)</h2>
        <DishCard
          variant="list"
          dishName="Chicken Kabab Roll"
          price={200}
          image="https://via.placeholder.com/150"
        />

        <h2 className="text-xl font-bold mt-10">Dish (Search Result)</h2>
        <DishCard
          variant="search-result"
          dishName="Veg Paneer Wrap"
          price={180}
          image="https://via.placeholder.com/150"
        />
      </div>
    </div>
  );
};

export default Demo;
