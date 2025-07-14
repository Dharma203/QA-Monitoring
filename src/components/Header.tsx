"use client";

import React from "react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white z-40 shadow px-6 flex items-center">
      <div className="w-full text-center sm:text-left">
        <img
          src="/logo-banklampung.png"
          alt="Bank Lampung"
          className="max-h-12 h-auto w-auto object-contain inline-block"
        />
      </div>
    </header>
  );
};

export default Header;
