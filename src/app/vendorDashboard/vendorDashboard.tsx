"use client";

import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import InventoryTable from "./components/InventoryTable";
import DateFilter from "./components/DateFilter";
import DownloadButton from "./components/DownloadButton";

import styles from "./styles/InventoryReport.module.scss";
import { InventoryReport, transformApiReport } from "./types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "<UNDEFINED>";

export default function VendorDashboardPage() {
  const VENDOR_ID = "683461e610d75a5ba7b773eb";

  // two pieces of state
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [appliedDate, setAppliedDate] = useState(selectedDate);

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

  // fetch helper
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
    } catch (err: any) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  // on mount, fetch for today's date
  useEffect(() => {
    fetchReport(appliedDate);
  }, [appliedDate]);

  // when the user clicks Filter, we update appliedDate
  const applyFilter = () => {
    setAppliedDate(selectedDate);
  };

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
