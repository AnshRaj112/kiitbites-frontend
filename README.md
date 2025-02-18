# KIITBites - Web Application

## Introduction
**KIITBites** is a comprehensive online food ordering and inventory management platform designed exclusively for the KIIT University campus. The platform aims to enhance the food ordering experience by providing a seamless, time-efficient, and convenient way for students and faculty to access food across multiple food courts while also helping food vendors manage their inventory effectively.

## Problem Statement
During peak hours, food courts on campus experience long queues, resulting in extended wait times for students. This not only disrupts their schedules but also leads to operational inefficiencies and food shortages due to poor inventory tracking. KIITBites addresses these challenges by offering a digital platform for streamlined food ordering and inventory management.

## Solution
KIITBites introduces an intuitive web application that integrates all food courts on the KIIT campus, providing:
- **A centralized menu system** displaying real-time availability of food items.
- **Online ordering** with real-time tracking and notifications.
- **An inventory management system** for vendors to monitor stock levels efficiently.
- **Offline functionality** for food vendors, allowing them to continue operations even without an internet connection.

## Features
### User-Focused Features:
- **Complete Online Ordering System:**
  - Eliminates offline, in-person ordering, reducing long wait times.
  - Users can place orders from multiple food courts in a single platform.
- **Real-Time Multi-Food Court Integration:**
  - Users can browse food courts, check menus, and view real-time stock availability.
  - Ability to locate specific dishes across different food courts.
- **Order Management:**
  - Unique order tracking numbers.
  - Live status updates from order placement to completion.
- **Premium Membership Benefits:**
  - Priority order processing.
  - Ability to schedule meals in advance.

### Vendor-Focused Features:
- **Inventory Management System:**
  - Allows vendors to manage stock efficiently.
  - Real-time updates with low-stock notifications and expiry alerts.
  - Offline functionality for seamless inventory updates even during network issues.
- **Order Queue Management:**
  - Helps vendors track and process orders in real time.
  - Reduces food wastage by improving stock management.
- **Financial Tracking and Reporting:**
  - Vendors can monitor revenue, payment statuses, and order analytics.

## Tech Stack
- **Frontend:** Next.js with TypeScript, module.scss
- **Backend:** Node.js, Express.js, MongoDB
- **Security:** JWT authentication, SSL encryption, and secure data handling

## Environment Variables
Create a `.env` file in the root directory and add the following variables:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_BACKEND_URL=your_backend_url
BACKEND_URL=your_backend_url
```

## Payment Integration
- Supports multiple payment options, including UPI, credit/debit cards, and digital wallets.
- Ensures pre-payment for prepared food items to avoid wastage and enhance service efficiency.

## Detailed Page Breakdown
### 1. **User Pages:**
#### - Landing Page:
  - Displays platform features, ongoing promotions, and an introduction to KIITBites.
  - Provides quick access to login/sign-up options.
#### - Sign-Up & Login Page:
  - Allows users to register using email, phone number, or KIIT credentials.
  - Google authentication for quick access.
  - Secure login system with two-factor authentication (2FA) support.
#### - Home Page:
  - Displays available food courts, trending dishes, and user-recommended meals.
  - Personalized suggestions based on previous orders.
#### - Search & Results Page:
  - Allows users to search by dish name, food court, or category.
  - Advanced filters for sorting by price, popularity, or dietary preferences.
#### - Food Court & Food Detail Pages:
  - Showcases available items from a selected food court.
  - Displays dish details, ingredients, customization options, and real-time stock levels.
#### - Cart & Payment Pages:
  - Provides an intuitive cart system with the ability to modify or remove items.
  - Supports multiple payment options with real-time validation.
  - Displays payment confirmation and estimated preparation time.
#### - Ongoing Orders & Order History Pages:
  - Users can track real-time order statuses.
  - Order history available for reordering and review submission.
#### - User Profile & Wallet Pages:
  - Displays user details, order preferences, and membership status.
  - Wallet integration for faster transactions and balance tracking.

### 2. **Admin/Vendor Pages:**
#### - Admin Dashboard:
  - Provides an overview of platform performance, including total orders, sales, and revenue.
#### - Vendor Dashboard:
  - Displays order analytics and food court-specific data.
  - Allows food courts to update menus, pricing, and availability.
#### - Inventory Management:
  - Enables vendors to update stock, track low-stock alerts, and manage food categories.
#### - Order Processing & Queue Management:
  - Provides tools to efficiently handle orders, update statuses, and notify customers.
#### - Payment & Financial Reports:
  - Allows vendors to monitor transactions, pending payments, and generate financial reports.

## Potential Issues & Solutions
- **Stock Availability Conflict:**
  - Displays “few left” indicator when items are running low.
  - Smart stock allocation prevents overselling.
- **Order Tracking:**
  - Each order receives a unique tracking ID with real-time status updates.
- **Network Issues:**
  - Offline mode ensures orders are queued and synchronized upon reconnection.
- **Payment Failures:**
  - Retry mechanisms with alternative payment options.
- **Overcrowding at Pickup Counters:**
  - Digital queue system to manage user pickup times.

## How to Run the Project
### Prerequisites
- Node.js and npm installed
- MongoDB setup

### Installation Steps
1. **Fork the repository** on GitHub.
2. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/KIITBites.git
   cd KIITBites
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a new branch** following the naming convention:
   - For new features: `features/feature-name`
   - For bug fixes: `fixes/fix-name/feature-name`
   ```bash
   git checkout -b features/your-feature-name
   ```
5. **Start the development server**:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000` in your browser.

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b features/feature-name` or `fixes/fix-name`).
3. Commit your changes (`git commit -m 'Added new feature'`).
4. Push to your branch (`git push origin features/feature-name`).
5. Open a pull request.

## License
This project is licensed under the MIT License.

## Contact
For queries or contributions, contact the **KIITBites Team** at [kiitbites@gmail.com](mailto:kiitbites@gmail.com).

## Design Reference
Figma Link: [Click Here](https://www.figma.com/design/uCTZfzhDkk06FNwA2Ooc4G/KIITBites?node-id=0-1&t=eN4BzoUfe3aSVfNt-0)
