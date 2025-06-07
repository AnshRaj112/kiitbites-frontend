import { createPortal } from 'react-dom';
import styles from "./styles/Search.module.scss";
import { Vendor } from "@/app/home/[slug]/types";

interface SearchVendorModalProps {
  show: boolean;
  availableVendors: Vendor[];
  selectedVendor: Vendor | null;
  onVendorSelect: (vendor: Vendor) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const SearchVendorModal = ({
  show,
  availableVendors,
  selectedVendor,
  onVendorSelect,
  onConfirm,
  onCancel,
}: SearchVendorModalProps) => {
  if (!show) return null;

  return createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Select Vendor</h2>
        <div className={styles.vendorList}>
          {availableVendors.map((vendor) => (
            <div
              key={vendor._id}
              className={`${styles.vendorItem} ${
                selectedVendor?._id === vendor._id ? styles.selected : ""
              }`}
              onClick={() => onVendorSelect(vendor)}
            >
              <h3>{vendor.name}</h3>
              <p>₹{vendor.price}</p>
            </div>
          ))}
        </div>
        <div className={styles.modalButtons}>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={styles.confirmButton}
            onClick={onConfirm}
            disabled={!selectedVendor}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SearchVendorModal; 