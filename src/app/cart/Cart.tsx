import { useEffect, useState } from "react";
import axios from "axios";
import CartItemCard from "../components/CartItemCard";
import ExtrasCard from "../components/ExtrasCard";
import BillBox from "../components/BillBox";
import styles from "./styles/Cart.module.scss";
import { FoodItem, CartItem } from "../types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [extras, setExtras] = useState<FoodItem[]>([]);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [userFullName, setUserFullName] = useState<string | null>(null);

  // Check if the user is logged in by fetching user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${BACKEND_URL}/api/auth/user`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserLoggedIn(true); // Set the user as logged in
          setUserFullName(data.fullName); // Set user's full name
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  // Fetch cart and extras from backend on load
  useEffect(() => {
    if (userLoggedIn) {
      axios
        .get(`${BACKEND_URL}/api/cart`, { withCredentials: true })
        .then((res) => setCart(res.data.cart || []))
        .catch((err) => console.error("Error loading cart:", err));

      axios
        .get(`${BACKEND_URL}/api/cart/extras`)
        .then((res) => setExtras(res.data))
        .catch((err) => console.error("Error loading extras:", err));
    } else {
      // For guest users, check the localStorage for cart items
      const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "[]");
      setCart(guestCart);

      // Optionally fetch extras for guest users
      axios
        .get(`${BACKEND_URL}/api/cart/extras`)
        .then((res) => setExtras(res.data))
        .catch((err) => console.error("Error loading extras:", err));
    }
  }, [userLoggedIn]);

  const addToCart = (item: FoodItem) => {
    if (userLoggedIn) {
      axios
        .post(
          `${BACKEND_URL}/api/cart/add`,
          { foodId: item._id },
          { withCredentials: true }
        )
        .then((res) => setCart(res.data.cart))
        .catch((err) => console.error("Error adding item:", err));
    } else {
      const updatedCart = [...cart, { ...item, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
    }
  };

  const increaseQty = (id: string) => {
    if (userLoggedIn) {
      axios
        .patch(
          `${BACKEND_URL}/api/cart/increment`,
          { foodId: id },
          { withCredentials: true }
        )
        .then((res) => setCart(res.data.cart))
        .catch((err) => console.error("Error increasing quantity:", err));
    } else {
      const updatedCart = cart.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
      localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
    }
  };

  const decreaseQty = (id: string, remove = false) => {
    if (remove) {
      if (userLoggedIn) {
        axios
          .delete(`${BACKEND_URL}/api/cart/remove/${id}`, {
            withCredentials: true,
          })
          .then((res) => setCart(res.data.cart))
          .catch((err) => console.error("Error removing item:", err));
      } else {
        const updatedCart = cart.filter((item) => item._id !== id);
        setCart(updatedCart);
        localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
      }
    } else {
      if (userLoggedIn) {
        axios
          .patch(
            `${BACKEND_URL}/api/cart/decrement`,
            { foodId: id },
            { withCredentials: true }
          )
          .then((res) => setCart(res.data.cart))
          .catch((err) => console.error("Error decreasing quantity:", err));
      } else {
        const updatedCart = cart.map((item) =>
          item._id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
        setCart(updatedCart);
        localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
      }
    }
  };

  return (
    <div className={styles.cartPage}>
      <div className={styles.cartLeft}>
        <section className={styles.cartSection}>
          {cart.length === 0 ? (
            <div className={styles.emptyCartMessage}>
              <h2>Your cart is empty</h2>
              <p>Add some delicious items to get started!</p>
            </div>
          ) : (
            <div className={styles.cartItems}>
              {cart.map((item) => (
                <CartItemCard
                  key={item._id}
                  item={item}
                  onIncrease={increaseQty}
                  onDecrease={decreaseQty}
                />
              ))}
            </div>
          )}
        </section>

        <section className={styles.extrasSection}>
          <h3>Order More / Extras</h3>
          <div
            className={`${styles.extrasList} ${
              extras.length === 1 ? styles.singleCard : ""
            }`}
          >
            {extras.length > 0 ? (
              extras.map((item) => (
                <ExtrasCard key={item._id} item={item} onAdd={addToCart} />
              ))
            ) : (
              <p className={styles.emptyExtras}>No extras available.</p>
            )}
          </div>
        </section>
      </div>

      <aside className={styles.cartRight}>
        <div className={styles.billBox}>
          <BillBox items={cart} onProceed={() => {}} />
        </div>
      </aside>
    </div>
  );
}
