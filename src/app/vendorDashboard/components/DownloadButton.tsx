// components/DownloadButton.tsx
"use client";

import { FiDownload } from "react-icons/fi";
import * as XLSX from "xlsx";
import styles from "../styles/DateFilter.module.scss";
import { InventoryReport } from "../types";

interface Props
  extends Pick<
    InventoryReport,
    "vendorName" | "reportDate" | "stats" | "items"
  > {}

export default function DownloadButton({
  vendorName,
  reportDate,
  stats,
  items,
}: Props) {
  const handleDownload = () => {
    // 1) Create a new workbook
    const wb = XLSX.utils.book_new();

    // 2) Build one sheet data:
    //    - Stats table at the top
    //    - blank row
    //    - Inventory header + rows
    const statsTable: (string | number)[][] = [
      ["Metric", "Value"],
      ["Total Items Tracked", stats.totalTracked],
      ["Items Sold Today", stats.soldToday],
      ["Items Received", stats.receivedToday],
    ];

    const spacer: any[][] = [[]]; // single blank row

    const header = [
      "Item Name",
      "Opening Stock",
      "Received",
      "Sold",
      "Closing Stock",
      "Item Type",
    ];
    const inventoryRows = items.map((i) => [
      i.name,
      i.opening,
      i.received,
      i.sold,
      i.closing,
      i.itemType,
    ]);

    const sheetData = [...statsTable, ...spacer, header, ...inventoryRows];

    // 3) Convert to a worksheet and append
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, "Report");

    // 4) Trigger the download
    const filename = `${vendorName}.${reportDate}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  return (
    <button className={styles.download} onClick={handleDownload}>
      <FiDownload /> Download Report
    </button>
  );
}
