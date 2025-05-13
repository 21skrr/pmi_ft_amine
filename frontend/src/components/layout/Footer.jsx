// frontend/src/components/layout/Footer.jsx
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-3 px-4 sm:px-6 md:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
        <div>
          &copy; {currentYear} PMI Onboarding Portal. All rights reserved.
        </div>
        <div className="mt-2 sm:mt-0 flex space-x-4">
          <a href="#" className="hover:text-gray-700">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gray-700">
            Terms of Service
          </a>
          <a href="#" className="hover:text-gray-700">
            Help Center
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
