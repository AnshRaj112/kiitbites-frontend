"use client";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import InventoryTable from "./components/InventoryTable";
import DateFilter from "./components/DateFilter";
import DownloadButton from "./components/DownloadButton";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "<UNDEFINED>";

import styles from "./styles/InventoryReport.module.scss";
import { ApiReport, InventoryReport, transformApiReport } from "./types";

export default function VendorDashboardPage() {
  const VENDOR_ID = "6834622710d75a5ba7b77403";
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [report, setReport] = useState<InventoryReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSegment, setActiveSegment] =
    useState<string>("inventory-reports");

  const segmentsMap: Record<string, string> = {
    dashboard: "Dashboard",
    "retail-inventory": "Retail Inventory",
    "produce-inventory": "Produce Inventory",
    "raw-materials": "Raw Materials",
    "inventory-reports": "Inventory Reports",
    "reorder-requests": "Reorder Requests",
    settings: "Settings",
  };
  const fetchReport = async (d: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${BACKEND_URL}/inventoryreport/vendor/${VENDOR_ID}?date=${d}`
      );
      const json = await res.json();

      if (!json.success) {
        setReport(null);
        setError("No report found for the selected date.");
        return;
      }

      const transformed = transformApiReport(json.data);
      setReport(transformed);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unknown error");
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  // fetch on mount & whenever date changes
  useEffect(() => {
    fetchReport(date);
  }, [date]);
  return (
    <div className={styles.container}>
      <Sidebar
        active={activeSegment}
        onSegmentChange={setActiveSegment}
        vendorName={report?.vendorName}
        vendorId={report?.vendorId}
      />

      <main className={styles.main}>
        {activeSegment === "inventory-reports" ? (
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
                <DateFilter date={date} onChange={setDate} />
                <DownloadButton />
              </div>
            </div>

            {loading ? (
              <p>Loading report…</p>
            ) : error ? (
              <p className={styles.error}>{error}</p>
            ) : report ? (
              <InventoryTable items={report.items} date={report.reportDate} />
            ) : (
              <p>No report data available.</p> // fallback in case of unexpected null
            )}
          </>
        ) : (
          <div className={styles.underConstruction}>
            🚧 {segmentsMap[activeSegment] || activeSegment.replace(/-/g, " ")}{" "}
            is under construction.
          </div>
        )}
      </main>
    </div>
  );
}
