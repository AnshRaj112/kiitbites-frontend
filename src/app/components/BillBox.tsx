import React, { FormEvent, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CartItem, OrderType, OrderData } from "../../app/cart/types";
import styles from "./styles/BillBox.module.scss";

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  description: string;
  prefill: {
    name: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
  };
}

interface OrderResponse {
  orderId: string;
  razorpayOptions: {
    key: string;
    amount: number;
    currency: string;
    order_id: string;
  };
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): {
    open: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }
}

interface Props {
  userId: string;
  items: CartItem[];
  onOrder: (orderId: string) => void;
}

const BillBox: React.FC<Props> = ({ userId, items, onOrder }) => {
  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Calculate totals
  const itemTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const packaging =
    orderType !== "dinein"
      ? items
          .filter((i) => i.category === "Produce")
          .reduce((s, i) => s + 5 * i.quantity, 0)
      : 0;
  const delivery = orderType === "delivery" ? 50 : 0;
  const grandTotal = itemTotal + packaging + delivery;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !phone.trim() ||
      (orderType === "delivery" && !address.trim())
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const payload: OrderData = {
      orderType,
      collectorName: name,
      collectorPhone: phone,
      ...(orderType === "delivery" ? { address } : {}),
    };

    console.log("📦 Order payload:", payload);

    let orderResp;
    try {
      orderResp = await axios.post<OrderResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${userId}`,
        payload,
        {
          withCredentials: true,
        }
      );

      console.log("🧾 Order response:", orderResp.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Order request failed:", error.response?.data);
        toast.error(error.response?.data?.message || "Failed to place order.");
      } else {
        console.error("❌ Order request failed:", error);
        toast.error("Failed to place order.");
      }
      return;
    }

    const { orderId, razorpayOptions } = orderResp.data;

    const options: RazorpayOptions = {
      ...razorpayOptions,
      description: "Complete your payment",
      prefill: { name, contact: phone },
      theme: { color: "#01796f" },
      handler: async (rzRes: RazorpayResponse) => {
        console.log("💳 Razorpay payment success:", rzRes);

        try {
          const verifyPayload = {
            razorpay_order_id: rzRes.razorpay_order_id,
            razorpay_payment_id: rzRes.razorpay_payment_id,
            razorpay_signature: rzRes.razorpay_signature,
            orderId,
          };

          console.log("📨 Sending for verification:", verifyPayload);

          await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/verify`,
            verifyPayload,
            { withCredentials: true }
          );

          console.log("✅ Payment verified successfully");
          toast.success("Payment successful!");
          onOrder(orderId);

          // 🔁 Redirect to payment confirmation page
          window.location.href = `/payment?orderId=${orderId}`;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.error("❌ Payment verification failed:", error.response?.data);
          } else {
            console.error("❌ Payment verification failed:", error);
          }
          toast.error("Payment verification failed.");
        }
      },
      modal: {
        ondismiss: () => {
          console.warn("⚠️ Razorpay payment cancelled by user.");
          toast.info("Payment cancelled.");
        },
      },
    };

    try {
      console.log("🚀 Launching Razorpay with options:", options);
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("❌ Could not open Razorpay:", error);
      toast.error("Could not open payment gateway.");
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.segmentedControl}>
        {(["takeaway", "delivery", "dinein"] as OrderType[]).map((t) => (
          <button
            key={t}
            type="button"
            className={orderType === t ? styles.active : styles.segment}
            onClick={() => setOrderType(t)}
          >
            {t === "takeaway"
              ? "takeaway"
              : t === "delivery"
              ? "Delivery"
              : "Dine In"}
          </button>
        ))}
      </div>

      <input
        className={styles.input}
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        className={styles.input}
        placeholder="Phone"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      {orderType === "delivery" && (
        <textarea
          className={styles.textarea}
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      )}

      <div className={styles.bill}>
        {items.map((i) => (
          <div key={i._id} className={styles.line}>
            <span>
              {i.name} ×{i.quantity}
            </span>
            <span>₹{i.price * i.quantity}</span>
          </div>
        ))}

        {packaging > 0 && (
          <div className={styles.extra}>
            <span>Packaging</span>
            <span>₹{packaging}</span>
          </div>
        )}
        {delivery > 0 && (
          <div className={styles.extra}>
            <span>Delivery Charge</span>
            <span>₹{delivery}</span>
          </div>
        )}

        <div className={styles.divider} />

        <div className={styles.total}>
          <strong>Total</strong>
          <strong>₹{grandTotal}</strong>
        </div>
      </div>

      <button type="submit" className={styles.button}>
        Proceed to Payment
      </button>
    </form>
  );
};

export default BillBox;
