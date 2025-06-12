"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import InventoryTable from "./components/InventoryTable";
import DateFilter from "./components/DateFilter";
import DownloadButton from "./components/DownloadButton";
import { OrderList } from "./components/OrderList"; // <-- import OrderList

import styles from "./styles/InventoryReport.module.scss";
import { InventoryReport, transformApiReport } from "./types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "<UNDEFINED>";

const segmentsMap: Record<string, string> = {
  dashboard: "Dashboard",
  "inventory-reports": "Inventory Reports",
  // You can define more segments here
};

export default function VendorDashboardPage() {
  const VENDOR_ID = "6834622e10d75a5ba7b7740d";

  const [activeSegment, setActiveSegment] = useState<string>("dashboard");

  useEffect(() => {
    const saved = localStorage.getItem("activeSegment");
    if (saved) setActiveSegment(saved);
  }, []);

  // Save active segment in localStorage
  useEffect(() => {
    localStorage.setItem("activeSegment", activeSegment);
  }, [activeSegment]);

  // For sidebar vendor display from report
  const [vendorNameFromOrders, setVendorNameFromOrders] = useState<
    string | undefined
  >();
  const [vendorIdFromOrders, setVendorIdFromOrders] = useState<
    string | undefined
  >();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [appliedDate, setAppliedDate] = useState(selectedDate);

  const [report, setReport] = useState<InventoryReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${BACKEND_URL}/inventoryreport/vendor/${VENDOR_ID}?date=${date}`
      );
      const json = await res.json();

      if (!json.success) {
        setReport(null);
        setError("No report found for the selected date.");
        return;
      }

      setReport(transformApiReport(json.data));
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSegment === "inventory-reports") {
      fetchReport(appliedDate);
    }
  }, [appliedDate, activeSegment]);

  const applyFilter = () => {
    setAppliedDate(selectedDate);
  };

  return (
    <div className={styles.container}>
      <Sidebar
        active={activeSegment}
        onSegmentChange={setActiveSegment}
        vendorName={report?.vendorName || vendorNameFromOrders}
        vendorId={report?.vendorId || vendorIdFromOrders}
      />

      <main className={styles.main}>
        {activeSegment === "inventory-reports" && (
          <>
            <div className={styles.header}>
              <h1>Inventory Reports</h1>
              <p>View and export detailed inventory reports</p>
            </div>
            <div className={styles.topBar}>
              <div className={styles.stats}>
                {report ? (
                  <>
                    <StatCard
                      label="Total Items Tracked"
                      value={report.stats.totalTracked}
                    />
                    <StatCard
                      label="Items Sold Today"
                      value={report.stats.soldToday}
                      positive
                    />
                    <StatCard
                      label="Items Received"
                      value={report.stats.receivedToday}
                    />
                  </>
                ) : (
                  <div>Loading stats…</div>
                )}
              </div>
              <div className={styles.controls}>
                <DateFilter
                  date={selectedDate}
                  onChange={setSelectedDate}
                  onFilter={applyFilter}
                />
                {report && (
                  <DownloadButton
                    vendorName={report.vendorName}
                    reportDate={report.reportDate}
                    stats={report.stats}
                    items={report.items}
                  />
                )}
              </div>
            </div>
            {loading ? (
              <p>Loading report…</p>
            ) : error ? (
              <p className={styles.error}>{error}</p>
            ) : report ? (
              <InventoryTable
                items={report.items ?? []}
                date={report.reportDate}
              />
            ) : (
              <p>No report data available.</p>
            )}
          </>
        )}

        {activeSegment === "dashboard" && (
          <>
            <div className={styles.header}>
              <h1>Active Orders</h1>
              <p>Manage your incoming orders in real-time</p>
            </div>
            <OrderList
              onLoaded={(vendorName, vendorId) => {
                setVendorNameFromOrders(vendorName);
                setVendorIdFromOrders(vendorId);
              }}
            />
          </>
        )}

        {activeSegment !== "inventory-reports" &&
          activeSegment !== "dashboard" && (
            <div className={styles.underConstruction}>
              🚧{" "}
              {segmentsMap[activeSegment] || activeSegment.replace(/-/g, " ")}{" "}
              is under construction.
            </div>
          )}
      </main>
    </div>
  );
}
