import Dishes from "../components/DishCard";
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
      <RestaurantComponent />
    </div>
  )
}
