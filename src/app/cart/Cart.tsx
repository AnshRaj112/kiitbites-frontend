import { useEffect, useState } from "react";
import axios from "axios";
import CartItemCard from "../components/CartItemCard";
import ExtrasCard from "../components/ExtrasCard";
import BillBox from "../components/BillBox";
import styles from "./styles/Cart.module.scss";
import { FoodItem, CartItem } from "../cart/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "<UNDEFINED>";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("[Cart.tsx] getAuthHeaders: no token in localStorage");
    return { headers: {}, withCredentials: true };
  }
  return {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  };
};

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [extras, setExtras] = useState<FoodItem[]>([]);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [userFullName, setUserFullName] = useState<string | null>(null);

  useEffect(() => {
    console.log("[Cart.tsx] BACKEND_URL =", BACKEND_URL);
    const fetchExtras = async () => {
      try {
        console.log("[Cart.tsx] ▶︎ Calling GET", `${BACKEND_URL}/cart/extras`);
        const response = await axios.get(
          `${BACKEND_URL}/cart/extras`,
          getAuthHeaders()
        );
        console.log("[Cart.tsx] ← /cart/extras responded with:", response.data);

        // Response shape is { message, extras: [ { itemId, name, price, image, kind }, ... ] }
        const rawExtras = response.data.extras || [];
        const formatted: FoodItem[] = rawExtras.map((e: any) => ({
          _id: e.itemId,
          name: e.name,
          image: e.image,
          price: e.price,
          kind: e.kind,
        }));
        console.log("[Cart.tsx] → setExtras(...) to:", formatted);
        setExtras(formatted);
      } catch (err: any) {
        console.error(
          "[Cart.tsx] ❌ Error loading /cart/extras:",
          err.response?.status,
          err.response?.data || err.message
        );
        setExtras([]);
      }
    };

    const fetchUserAndCart = async () => {
      const token = localStorage.getItem("token");
      console.log("[Cart.tsx] ▶︎ Checking localStorage token:", token);

      if (!token) {
        console.log(
          "[Cart.tsx] No token found → using guest flow. Guest cart:",
          localStorage.getItem("guest_cart")
        );
        setUserLoggedIn(false);
        const rawGuest = localStorage.getItem("guest_cart") || "[]";
        try {
          setCart(JSON.parse(rawGuest));
        } catch {
          setCart([]);
        }
        return;
      }

      try {
        // 👀 Make sure this URL is correct for your backend.
        // If your user/auth route is still actually “/api/user/auth/user”, put that back in.
        const authUrl = `${BACKEND_URL}/api/user/auth/user`;
        console.log("[Cart.tsx] ▶︎ Calling FETCH", authUrl);
        const res = await fetch(authUrl, {
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(
          "[Cart.tsx] ← /user/auth/user status:",
          res.status,
          "ok?",
          res.ok
        );
        if (!res.ok) {
          console.warn(
            "[Cart.tsx] Token invalid or expired. Falling back to guest."
          );
          localStorage.removeItem("token");
          setUserLoggedIn(false);
          const rawGuest2 = localStorage.getItem("guest_cart") || "[]";
          try {
            setCart(JSON.parse(rawGuest2));
          } catch {
            setCart([]);
          }
          return;
        }

        const userData = await res.json();
        console.log("[Cart.tsx] ← /user/auth/user returned JSON:", userData);
        setUserLoggedIn(true);
        setUserFullName(userData.fullName);

        /** ─── GET /cart ─── **/
        console.log("[Cart.tsx] ▶︎ Calling GET", `${BACKEND_URL}/cart`);
        const cartRes = await axios.get(
          `${BACKEND_URL}/cart`,
          getAuthHeaders()
        );
        console.log("[Cart.tsx] ← /cart responded with:", cartRes.data);

        // cartRes.data.cart is [ { itemId, name, image, unit, price, quantity, kind, totalPrice }, … ]
        const rawCart = cartRes.data.cart || [];
        const detailedCart: CartItem[] = rawCart.map((c: any) => ({
          _id: c.itemId,
          name: c.name,
          image: c.image,
          unit: c.unit,
          price: c.price,
          quantity: c.quantity,
          kind: c.kind,
          totalPrice: c.totalPrice,
        }));
        console.log("[Cart.tsx] → setCart(...) to:", detailedCart);
        setCart(detailedCart);

        /** ─── GET /cart/extras (only if logged in and cart loaded) ─── **/
        await fetchExtras();
      } catch (error) {
        console.error("[Cart.tsx] ❌ Error in fetchUserAndCart():", error);
        localStorage.removeItem("token");
        setUserLoggedIn(false);
      }
    };

    fetchUserAndCart();
  }, []);

  const reFetchCart = async () => {
    try {
      console.log("[Cart.tsx] ▶︎ reFetchCart → GET", `${BACKEND_URL}/cart`);
      const cartRes = await axios.get(`${BACKEND_URL}/cart`, getAuthHeaders());
      console.log("[Cart.tsx] ← reFetchCart →", cartRes.data);
      const raw = cartRes.data.cart || [];
      const updated: CartItem[] = raw.map((c: any) => ({
        _id: c.itemId,
        name: c.name,
        image: c.image,
        unit: c.unit,
        price: c.price,
        quantity: c.quantity,
        kind: c.kind,
        totalPrice: c.totalPrice,
      }));
      setCart(updated);
    } catch (err) {
      console.error("[Cart.tsx] ❌ reFetchCart error:", err);
    }
  };

  const increaseQty = (id: string) => {
    const thisItem = cart.find((i) => i._id === id);
    if (!thisItem) {
      console.warn(
        `[Cart.tsx] increaseQty: item ${id} not found in state.cart`
      );
      return;
    }

    if (userLoggedIn) {
      console.log(
        `[Cart.tsx] ▶︎ POST /cart/add-one { itemId: ${id}, kind: ${thisItem.kind} }`
      );
      axios
        .post(
          `${BACKEND_URL}/cart/add-one`,
          { itemId: id, kind: thisItem.kind },
          getAuthHeaders()
        )
        .then(() => {
          console.log("[Cart.tsx] ← /cart/add-one succeeded, re-fetching cart");
          reFetchCart();
        })
        .catch((err) =>
          console.error("[Cart.tsx] ❌ /cart/add-one error:", err)
        );
    } else {
      const updatedCart = cart.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      console.log("[Cart.tsx] (guest) increaseQty → new cart:", updatedCart);
      setCart(updatedCart);
      localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
    }
  };

  const decreaseQty = (id: string) => {
    const thisItem = cart.find((i) => i._id === id);
    if (!thisItem) {
      console.warn(
        `[Cart.tsx] decreaseQty: item ${id} not found in state.cart`
      );
      return;
    }

    if (thisItem.quantity <= 0) {
      console.log(`[Cart.tsx] decreaseQty blocked: quantity is already 1`);
      return; // Do nothing — keep item with quantity = 1
    }

    if (userLoggedIn) {
      console.log(
        `[Cart.tsx] ▶︎ POST /cart/remove-one { itemId: ${id}, kind: ${thisItem.kind} }`
      );
      axios
        .post(
          `${BACKEND_URL}/cart/remove-one`,
          { itemId: id, kind: thisItem.kind },
          getAuthHeaders()
        )
        .then(() => {
          console.log(
            `[Cart.tsx] ← /cart/remove-one succeeded, re-fetching cart`
          );
          reFetchCart();
        })
        .catch((err) =>
          console.error(`[Cart.tsx] ❌ /cart/remove-one error:`, err)
        );
    } else {
      const updatedCart = cart.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
      console.log("[Cart.tsx] (guest) decreaseQty → new cart:", updatedCart);
      setCart(updatedCart);
      localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
    }
  };
  const removeItem = (id: string) => {
    const thisItem = cart.find((i) => i._id === id);
    if (!thisItem) {
      console.warn(`[Cart.tsx] removeItem: item ${id} not found in cart`);
      return;
    }

    if (userLoggedIn) {
      console.log(
        `[Cart.tsx] ▶︎ POST /cart/remove-item { itemId: ${id}, kind: ${thisItem.kind} }`
      );
      axios
        .post(
          `${BACKEND_URL}/cart/remove-item`,
          { itemId: id, kind: thisItem.kind },
          getAuthHeaders()
        )
        .then(() => {
          console.log(
            `[Cart.tsx] ← /cart/remove-item succeeded, re-fetching cart`
          );
          reFetchCart();
        })
        .catch((err) =>
          console.error(`[Cart.tsx] ❌ /cart/remove-item error:`, err)
        );
    } else {
      const updatedCart = cart.filter((item) => item._id !== id);
      console.log("[Cart.tsx] (guest) removeItem → new cart:", updatedCart);
      setCart(updatedCart);
      localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
    }
  };

  const addToCart = (item: FoodItem) => {
    if (userLoggedIn) {
      console.log(
        `[Cart.tsx] ▶︎ POST /cart/add { itemId: ${item._id}, kind: ${item.kind}, quantity: 1 }`
      );
      axios
        .post(
          `${BACKEND_URL}/cart/add`,
          {
            itemId: item._id,
            kind: item.kind,
            quantity: 1,
          },
          getAuthHeaders()
        )
        .then(() => {
          console.log("[Cart.tsx] ← /cart/add succeeded, re-fetching cart");
          reFetchCart();
        })
        .catch((err) => console.error("[Cart.tsx] ❌ /cart/add error:", err));
    } else {
      const existingItem = cart.find((i) => i._id === item._id);
      const updatedCart: CartItem[] = existingItem
        ? cart.map((i) =>
            i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...cart, { ...item, quantity: 1 }];
      console.log("[Cart.tsx] (guest) addToCart → new cart:", updatedCart);
      setCart(updatedCart);
      localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
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
              {cart.map((item, index) => (
                <CartItemCard
                  key={item._id ?? index}
                  item={item}
                  onIncrease={() => increaseQty(item._id)}
                  onDecrease={() => decreaseQty(item._id)} // Just decrease by 1
                  onRemove={() => removeItem(item._id)} // Fully remove item
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
                <ExtrasCard
                  key={item._id}
                  item={item}
                  onAdd={() => addToCart(item)}
                />
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
