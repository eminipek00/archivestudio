"use client";

import React from "react";
import { Search, Upload, Archive } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-effect rounded-2xl px-6 py-3 shadow-glass">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300">
            <Archive size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Archive Studio
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
          <Search className="absolute left-3 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Asset veya preset ara..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all placeholder:text-gray-600"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]">
            <Upload size={16} />
            Yükle
          </button>
          <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all overflow-hidden">
            <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                alt="Avatar" 
                className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
