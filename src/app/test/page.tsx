import DishCard from "../components/DishCard";
import RestaurantComponent from "../components/RestaurantCard";

export default function TestPage(){
  return (
    <div>
      <DishCard 
        dishName="Paneer Butter Masala"
        price={199}
        image="https://res.cloudinary.com/dt45pu5mx/image/upload/v1744159414/Screenshot_2025-04-09_055439_aucvs9.png"
        variant="list" // optional
    />
      <RestaurantComponent 
  restaurantName="Spice Garden"
  restaurantImage="https://res.cloudinary.com/dt45pu5mx/image/upload/v1744159414/spice_garden.png"
  cuisine="North Indian, Chinese"
  location="KIIT Square, Bhubaneswar"
  distance="1.2 km away"
  rating={4.3}
  description="Authentic flavors with a modern twist"
  variant="highlight" // optional
/>

    </div>
  )
}
