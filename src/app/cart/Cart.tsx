import { useEffect, useState } from "react";
import axios from "axios";
import CartItemCard from "../components/CartItemCard";
import ExtrasCard from "../components/ExtrasCard";
import BillBox from "../components/BillBox";
import styles from "./styles/Cart.module.scss";
import { FoodItem, CartItem } from "../cart/types";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "<UNDEFINED>";

interface ExtraItem {
  itemId: string;
  name: string;
  price: number;
  image: string;
  kind: string;
}

interface CartResponse {
  cart: Array<{
    itemId: string;
    name: string;
    image: string;
    unit: string;
    price: number;
    quantity: number;
    kind: string;
    totalPrice: number;
  }>;
  vendorName: string;
  vendorId: string;
}

interface ExtrasResponse {
  message: string;
  extras: ExtraItem[];
}

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

const getVendorName = (vendorName: string | undefined) => {
  if (!vendorName) {
    console.log("No vendorName provided");
    return "Unknown Vendor";
  }
  return vendorName;
};

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [extras, setExtras] = useState<FoodItem[]>([]);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [userData, setUserData] = useState<{ _id: string; foodcourtId: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log("[Cart.tsx] BACKEND_URL =", BACKEND_URL);
    const fetchExtras = async () => {
      if (!userData?._id) return;
      
      try {
        console.log("[Cart.tsx] ▶︎ Calling GET", `${BACKEND_URL}/cart/extras/${userData._id}`);
        const response = await axios.get<ExtrasResponse>(
          `${BACKEND_URL}/cart/extras/${userData._id}`,
          getAuthHeaders()
        );
        console.log("[Cart.tsx] ← /cart/extras responded with:", response.data);

        if (response.data.extras) {
          const formatted: FoodItem[] = response.data.extras.map((e: ExtraItem) => ({
            _id: e.itemId,
            name: e.name,
            image: e.image,
            price: e.price,
            kind: e.kind,
          }));
          console.log("[Cart.tsx] → setExtras(...) to:", formatted);
          setExtras(formatted);
        } else {
          setExtras([]);
        }
      } catch (err: unknown) {
        console.error("[Cart.tsx] ❌ Error loading extras:", err);
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
        setUserData(userData);

        /** ─── GET /cart ─── **/
        console.log("[Cart.tsx] ▶︎ Calling GET", `${BACKEND_URL}/cart/${userData._id}`);
        const cartRes = await axios.get<CartResponse>(
          `${BACKEND_URL}/cart/${userData._id}`,
          getAuthHeaders()
        );
        console.log("[Cart.tsx] ← /cart responded with:", cartRes.data);

        const rawCart = cartRes.data.cart || [];
        const detailedCart: CartItem[] = rawCart.map((c) => ({
          _id: c.itemId,
          userId: userData._id,
          foodcourtId: userData.foodcourtId,
          itemId: {
            _id: c.itemId,
            name: c.name,
            price: c.price,
            image: c.image,
            kind: c.kind
          },
          quantity: c.quantity,
          kind: c.kind,
          name: c.name,
          price: c.price,
          image: c.image,
          vendorName: cartRes.data.vendorName
        }));
        console.log("[Cart.tsx] → setCart(...) to:", detailedCart);
        setCart(detailedCart);

        // Fetch extras after cart is loaded
        await fetchExtras();
      } catch (error: unknown) {
        console.error("[Cart.tsx] ❌ Error in fetchUserAndCart():", error);
        localStorage.removeItem("token");
        setUserLoggedIn(false);
      }
    };

    fetchUserAndCart();
  }, []);

  // Add a new useEffect to refetch extras when cart changes
  useEffect(() => {
    if (userData?._id && cart.length > 0) {
      const fetchExtras = async () => {
        try {
          console.log("[Cart.tsx] ▶︎ Refetching extras for user:", userData._id);
          const response = await axios.get<ExtrasResponse>(
            `${BACKEND_URL}/cart/extras/${userData._id}`,
            getAuthHeaders()
          );
          
          if (response.data.extras) {
            const formatted: FoodItem[] = response.data.extras.map((e: ExtraItem) => ({
              _id: e.itemId,
              name: e.name,
              image: e.image,
              price: e.price,
              kind: e.kind,
            }));
            setExtras(formatted);
          } else {
            setExtras([]);
          }
        } catch (err) {
          console.error("[Cart.tsx] ❌ Error refetching extras:", err);
          setExtras([]);
        }
      };

      fetchExtras();
    } else {
      setExtras([]);
    }
  }, [cart, userData?._id]);

  const reFetchCart = async () => {
    try {
      if (!userData) return;
      console.log("[Cart.tsx] ▶︎ reFetchCart → GET", `${BACKEND_URL}/cart/${userData._id}`);
      const cartRes = await axios.get<CartResponse>(
        `${BACKEND_URL}/cart/${userData._id}`,
        getAuthHeaders()
      );
      console.log("[Cart.tsx] ← reFetchCart →", cartRes.data);
      const raw = cartRes.data.cart || [];
      const updated: CartItem[] = raw.map((c) => ({
        _id: c.itemId,
        userId: userData._id,
        foodcourtId: userData.foodcourtId,
        itemId: {
          _id: c.itemId,
          name: c.name,
          price: c.price,
          image: c.image,
          kind: c.kind
        },
        quantity: c.quantity,
        kind: c.kind,
        name: c.name,
        price: c.price,
        image: c.image,
        vendorName: cartRes.data.vendorName
      }));
      setCart(updated);
    } catch (err: unknown) {
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

    if (userLoggedIn && userData) {
      console.log(
        `[Cart.tsx] ▶︎ POST /cart/add-one/${userData._id} { itemId: ${id}, kind: ${thisItem.kind} }`
      );
      axios
        .post(
          `${BACKEND_URL}/cart/add-one/${userData._id}`,
          { itemId: id, kind: thisItem.kind },
          getAuthHeaders()
        )
        .then(() => {
          console.log("[Cart.tsx] ← /cart/add-one succeeded, re-fetching cart");
          toast.success(`Increased quantity of ${thisItem.name}`);
          reFetchCart();
        })
        .catch((err) => {
          console.error("[Cart.tsx] ❌ /cart/add-one error:", err);
          const errorMsg = err.response?.data?.message || "";
          if (errorMsg.includes("max quantity")) {
            toast.warning(`Maximum limit reached for ${thisItem.name}`);
          } else if (errorMsg.includes("Only")) {
            toast.warning(`Only ${errorMsg.split("Only ")[1]} available for ${thisItem.name}`);
          } else {
            toast.error("Failed to increase quantity");
          }
        });
    } else {
      const updatedCart = cart.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
      console.log("[Cart.tsx] (guest) increaseQty → new cart:", updatedCart);
      setCart(updatedCart);
      localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
      toast.success(`Increased quantity of ${thisItem.name}`);
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
      return;
    }

    if (userLoggedIn && userData) {
      console.log(
        `[Cart.tsx] ▶︎ POST /cart/remove-one/${userData._id} { itemId: ${id}, kind: ${thisItem.kind} }`
      );
      axios
        .post(
          `${BACKEND_URL}/cart/remove-one/${userData._id}`,
          { itemId: id, kind: thisItem.kind },
          getAuthHeaders()
        )
        .then(() => {
          console.log(
            `[Cart.tsx] ← /cart/remove-one succeeded, re-fetching cart`
          );
          toast.info(`Decreased quantity of ${thisItem.name}`);
          reFetchCart();
        })
        .catch((err) => {
          console.error(`[Cart.tsx] ❌ /cart/remove-one error:`, err);
          toast.error(err.response?.data?.message || "Failed to decrease quantity");
        });
    } else {
      const updatedCart = cart.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity - 1 } : item
      );
      console.log("[Cart.tsx] (guest) decreaseQty → new cart:", updatedCart);
      setCart(updatedCart);
      localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
      toast.info(`Decreased quantity of ${thisItem.name}`);
    }
  };

  const removeItem = (id: string) => {
    const thisItem = cart.find((i) => i._id === id);
    if (!thisItem) {
      console.warn(`[Cart.tsx] removeItem: item ${id} not found in cart`);
      return;
    }

    if (userLoggedIn && userData) {
      console.log(
        `[Cart.tsx] ▶︎ POST /cart/remove-item/${userData._id} { itemId: ${id}, kind: ${thisItem.kind} }`
      );
      axios
        .post(
          `${BACKEND_URL}/cart/remove-item/${userData._id}`,
          { itemId: id, kind: thisItem.kind },
          getAuthHeaders()
        )
        .then(() => {
          console.log(
            `[Cart.tsx] ← /cart/remove-item succeeded, re-fetching cart`
          );
          toast.error(`${thisItem.name} removed from cart`);
          reFetchCart();
        })
        .catch((err) => {
          console.error(`[Cart.tsx] ❌ /cart/remove-item error:`, err);
          toast.error(err.response?.data?.message || "Failed to remove item");
        });
    } else {
      const updatedCart = cart.filter((item) => item._id !== id);
      console.log("[Cart.tsx] (guest) removeItem → new cart:", updatedCart);
      setCart(updatedCart);
      localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
      toast.error(`${thisItem.name} removed from cart`);
    }
  };

  const addToCart = (item: FoodItem) => {
    if (userLoggedIn && userData) {
      console.log(
        `[Cart.tsx] ▶︎ POST /cart/add/${userData._id} { itemId: ${item._id}, kind: ${item.kind}, quantity: 1 }`
      );
      axios
        .post(
          `${BACKEND_URL}/cart/add/${userData._id}`,
          {
            itemId: item._id,
            kind: item.kind,
            quantity: 1,
          },
          getAuthHeaders()
        )
        .then(() => {
          console.log("[Cart.tsx] ← /cart/add succeeded, re-fetching cart");
          toast.success(`${item.name} added to cart!`);
          reFetchCart();
        })
        .catch((err) => {
          console.error("[Cart.tsx] ❌ /cart/add error:", err);
          const errorMsg = err.response?.data?.message || "";
          if (errorMsg.includes("max quantity")) {
            toast.warning(`Maximum limit reached for ${item.name}`);
          } else if (errorMsg.includes("Only")) {
            toast.warning(`Only ${errorMsg.split("Only ")[1]} available for ${item.name}`);
          } else {
            toast.error("Failed to add item to cart");
          }
        });
    } else {
      const existingItem = cart.find((i) => i._id === item._id);
      const updatedCart = existingItem
        ? cart.map((i) =>
            i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...cart, {
            _id: item._id,
            userId: 'guest',
            foodcourtId: 'guest',
            itemId: {
              _id: item._id,
              name: item.name,
              price: item.price,
              image: item.image,
              kind: item.kind || 'Retail'
            },
            quantity: 1,
            kind: item.kind || 'Retail',
            name: item.name,
            price: item.price,
            image: item.image
          }];
      console.log("[Cart.tsx] (guest) addToCart → new cart:", updatedCart);
      setCart(updatedCart);
      localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
      toast.success(`${item.name} added to cart!`);
    }
  };

  // Filter out items that are already in cart
  const filteredExtras = extras.filter(extra => 
    !cart.some(cartItem => cartItem._id === extra._id)
  );

  return (
    <div className={styles.cartPage}>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className={styles.cartLeft}>
        <section className={styles.cartSection}>
          {cart.length === 0 ? (
            <div className={styles.emptyCartMessage}>
              <h2>Oops! Your cart is empty</h2>
              <p>Looks like you haven&apos;t added any items to your cart yet.</p>
              <button 
                className={styles.homeButton}
                onClick={() => router.push('/home')}
              >
                Go to Home
              </button>
            </div>
          ) : (
            <>
              <div className={styles.vendorInfo}>
                <h3>Vendor: {getVendorName(cart[0]?.vendorName)}</h3>
              </div>
              <div className={styles.cartItems}>
                {cart.map((item, index) => (
                  <CartItemCard
                    key={item._id ?? index}
                    item={item}
                    onIncrease={() => increaseQty(item._id)}
                    onDecrease={() => decreaseQty(item._id)}
                    onRemove={() => removeItem(item._id)}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {cart.length > 0 && (
          <section className={styles.extrasSection}>
            <h3>More from {getVendorName(cart[0]?.vendorName)}</h3>
            <div
              className={`${styles.extrasList} ${
                filteredExtras.length === 1 ? styles.singleCard : ""
              }`}
            >
              {filteredExtras.length > 0 ? (
                filteredExtras.map((item) => {
                  const cartItem = cart.find(cartItem => cartItem._id === item._id);
                  const quantity = cartItem?.quantity || 0;
                  
                  return (
                    <ExtrasCard
                      key={item._id}
                      item={item}
                      onAdd={addToCart}
                      onIncrease={increaseQty}
                      onDecrease={decreaseQty}
                      quantity={quantity}
                    />
                  );
                })
              ) : (
                <p className={styles.emptyExtras}>No extras available.</p>
              )}
            </div>
          </section>
        )}
      </div>

      {cart.length > 0 && (
        <aside className={styles.cartRight}>
          <div className={styles.billBox}>
            <BillBox items={cart} onProceed={() => {}} />
          </div>
        </aside>
      )}
    </div>
  );
}
