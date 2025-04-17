import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className="px-8 bg-gray-100 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1>
          <Link href="/">SEOTool</Link>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Services</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
