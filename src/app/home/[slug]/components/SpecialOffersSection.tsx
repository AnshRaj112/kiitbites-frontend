import Slider, { Settings } from "react-slick";
import styles from "../styles/CollegePage.module.scss";
import { FoodItem } from "../types";

interface SpecialOffersSectionProps {
  items: { [key: string]: FoodItem[] };
  sliderSettings: Settings;
}

const SpecialOffersSection = ({ items, sliderSettings }: SpecialOffersSectionProps) => {
  const specialItems = Object.values(items)
    .flat()
    .filter((item) => item.isSpecial === "Y");

  if (specialItems.length === 0) return null;

  return (
    <div className={styles.specialSection}>
      <h2 className={styles.specialTitle}>Special Offers</h2>
      <div className={styles.carouselContainer}>
        <Slider {...sliderSettings} className={styles.slider}>
          {specialItems.map((item) => (
            <div key={item.id} className={styles.slideWrapper}>
              <div className={styles.foodCard}>
                <div className={styles.imageContainer}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={styles.foodImage}
                  />
                </div>
                <h4 className={styles.foodTitle}>{item.title}</h4>
                <p className={styles.foodPrice}>₹{item.price}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default SpecialOffersSection; 