import React from "react";

const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-bitesbay-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <img
              src="https://res.cloudinary.com/dt45pu5mx/image/upload/v1748277700/FullLogo_Transparent_NoBuffer_3_zfoohq.png"
              alt="BitesBay Logo"
              className="w-full max-w-[200px] h-auto mb-4"
            />

            <p className="mb-4 text-gray-300">
              Connecting campus communities with their favorite food vendors.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="X (formerly Twitter)"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"
                    transform="scale(1.5)"
                  />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-bitesbay-light">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/team"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Team
                </a>
              </li>
              {/* <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </a>
              </li> */}
              {/* <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Press
                </a>
              </li> */}
              {/* <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Partner With Us
                </a>
              </li> */}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-bitesbay-light">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/help"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/privacypolicy"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/termncondition"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/refundcancellationpolicy"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Refund & Cancellation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-bitesbay-light">
              Contact Us
            </h3>
            <address className="not-italic">
              <p className="mb-2 text-gray-300">
                123 Campus Way
                <br />
                College Town, CT 10101
              </p>
              <p className="mb-2">
                <a
                  href="mailto:contact@bitesbay.com"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  contact@bitesbay.com
                </a>
              </p>
              <p>
                <a
                  href="tel:+18005551234"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  (800) 555-1234
                </a>
              </p>
            </address>
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2 text-gray-300">
                Download Our App
              </h4>
              <div className="flex space-x-2">
                <a
                  href="#"
                  className="border border-gray-500 rounded px-3 py-1 text-xs flex items-center hover:bg-bitesbay-accent transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="M12 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.5" />
                    <path d="M16 19h6" />
                    <path d="M19 16v6" />
                  </svg>
                  App Store
                </a>
                <a
                  href="#"
                  className="border border-gray-500 rounded px-3 py-1 text-xs flex items-center hover:bg-bitesbay-accent transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="m12 19-7-7 7-7" />
                    <path d="m19 12-7 7-7-7" />
                  </svg>
                  Play Store
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} BitesBay. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a
                href="/privacypolicy"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/termncondition"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/refundcancellationpolicy"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Refund & Cancellation
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
