import React from "react";

const Footer = () => {
  return (
    <footer className="px-8 bg-gray-100 py-4">
      <div className="container mx-auto">
        <p className="text-center text-gray-600">
          &copy; {new Date().getFullYear()} SEO Audit Tool. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
