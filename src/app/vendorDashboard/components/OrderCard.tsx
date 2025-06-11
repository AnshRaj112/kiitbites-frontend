"use client";

import React, { useState } from "react";
import { Order } from "../types";
import styles from "../styles/OrderCard.module.scss";
import { ConfirmDialog } from "./ConfirmationDialogue";

export type LocalStatus = "inProgress" | "ready" | "onTheWay";

const statusLabels: Record<LocalStatus, string> = {
  inProgress: "Preparing",
  ready: "Ready to Pickup",
  onTheWay: "On The Way",
};

const typeColors: Record<Order["orderType"], string> = {
  delivery: "#4ea199",
  takeaway: "#4ea199",
  dinein: "#4ea199",
};

interface OrderCardProps {
  order: Order;
  localStatus: LocalStatus;
  onAdvance: (orderId: string, next: LocalStatus | "delivered") => void;
}

function formatTime(createdAt: string | Date): string {
  const date = new Date(createdAt);
  if (isNaN(date.getTime())) return "Invalid Date";

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  return date.toLocaleString("en-IN", options);
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  localStatus: workflow,
  onAdvance,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  let btnLabel: string;
  let nextState: LocalStatus | "delivered";

  if (workflow === "inProgress") {
    btnLabel = "Mark Ready";
    nextState = "ready";
  } else if (workflow === "ready") {
    if (order.orderType === "delivery") {
      btnLabel = "Start Delivery";
      nextState = "onTheWay";
    } else {
      btnLabel = "Mark Delivered";
      nextState = "delivered";
    }
  } else {
    btnLabel = "Mark Delivered";
    nextState = "delivered";
  }

  return (
    <div className={styles.card}>
      <div
        className={styles.stripe}
        style={{
          backgroundColor:
            workflow === "inProgress"
              ? "#fefcbf"
              : workflow === "ready"
              ? "#c6f6d5"
              : "#bee3f8",
        }}
      />

      <div className={styles.content}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <h3 className={styles.orderId}>{order.orderId}</h3>
            <span
              className={styles.typePill}
              style={{ backgroundColor: typeColors[order.orderType] }}
            >
              {order.orderType.charAt(0).toUpperCase() +
                order.orderType.slice(1)}
            </span>
          </div>
          <span
            className={`${styles.statusBadge} ${styles[`status--${workflow}`]}`}
          >
            {statusLabels[workflow]}
          </span>
        </div>

        {/* META */}
        <div className={styles.meta}>
          <div>Name: {order.collectorName}</div>
          <div>Phone: {order.collectorPhone}</div>
          {order.address && <div>Address: {order.address}</div>}
          <div>Ordered at: {formatTime(order.createdAt)}</div>
        </div>

        {/* ITEMS */}
        <ul className={styles.items}>
          {order.items.map((it) => (
            <li key={it.itemId}>
              <span className={styles.itemQty}>{it.quantity}×</span>
              <span className={styles.itemName}>{it.name}</span>
              <span className={styles.itemPrice}>
                ₹{(it.price * it.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>

        {/* FOOTER */}
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => setShowConfirm(true)}
          >
            {btnLabel}
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <ConfirmDialog
          title="Are you sure?"
          message={`Do you really want to ${btnLabel.toLowerCase()}?`}
          onCancel={() => setShowConfirm(false)}
          onConfirm={() => {
            onAdvance(order.orderId, nextState);
            setShowConfirm(false);
          }}
        />
      )}
    </div>
  );
};
