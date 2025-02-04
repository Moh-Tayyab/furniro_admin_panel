"use client";

const ThemedIcon = ({ icon: Icon, className }: { icon: React.ElementType; className?: string }) => (
	<Icon className={className || ''} />
  );

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaBox, FaChartBar, FaList, FaUser, FaTimes, FaBars, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

const SideBar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  return (
    <div className="z-50">
      {/* Mobile Header */}
      {!sidebarOpen && (
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] text-white h-16 w-full fixed top-0 left-0 z-10 md:hidden shadow-xl ">
          <h1 className="text-xl font-semibold font-[Poppins] tracking-wide">Furniro Admin</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white text-2xl hover:text-amber-400 transition-colors"
          >
            <FaBars />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transform fixed top-0 left-0 w-64 md:w-64 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] text-white h-full transition-transform duration-300 z-30 shadow-2xl`}
      >
        <div className="flex justify-between items-center px-4 md:px-6 py-4 md:py-6 border-b border-white/10">
          <div className="flex items-center gap-2 md:gap-4">
            <Image 
              src="/logo1.png" 
              alt="Logo" 
              width={32} 
              height={32}
              className="rounded-lg shadow-md"
            />
            <Link href="/">
            <h1 className="text-2xl font-bold font-[Poppins] tracking-wide text-amber-400">
                Furniro
              </h1>
            </Link>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white/80 hover:text-amber-400 text-xl md:hidden transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-1 mt-2 overflow-y-auto">
          <Link 
            href="/admin" 
            className="flex items-center gap-4 hover:bg-white/5 p-3 rounded-xl transition-all duration-300 group"
          >
            <div className="p-2 bg-amber-400/10 rounded-lg group-hover:bg-amber-400/20 transition-colors">
              <ThemedIcon icon={FaChartBar} className="w-5 h-5 text-amber-400" />
            </div>
            <span className="font-medium tracking-wide text-sm md:text-base">Dashboard</span>
          </Link>


          <Link 
            href="/admin/product" 
            className="flex items-center gap-4 hover:bg-white/5 p-3 rounded-xl transition-all duration-300 group"
          >
            <div className="p-2 bg-blue-400/10 rounded-lg group-hover:bg-blue-400/20 transition-colors">
              <ThemedIcon icon = {FaBox} className="w-5 h-5 text-blue-400" />
            </div>
            <span className="font-medium tracking-wide">Products</span>
          </Link>

          <Link 
            href="/admin/categories" 
            className="flex items-center gap-4 hover:bg-white/5 p-3 rounded-xl transition-all duration-300 group"
          >
            <div className="p-2 bg-emerald-400/10 rounded-lg group-hover:bg-emerald-400/20 transition-colors">
              <ThemedIcon icon = {FaList} className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="font-medium tracking-wide">Categories</span>
          </Link>

          <Link 
            href="/admin/customers" 
            className="flex items-center gap-4 hover:bg-white/5 p-3 rounded-xl transition-all duration-300 group"
          >
            <div className="p-2 bg-purple-400/10 rounded-lg group-hover:bg-purple-400/20 transition-colors">
              <ThemedIcon icon = {FaUser} className="w-5 h-5 text-purple-400" />
            </div>
            <span className="font-medium tracking-wide">Customers</span>
          </Link>

          <Link 
            href="/admin/orders" 
            className="flex items-center gap-4 hover:bg-white/5 p-3 rounded-xl transition-all duration-300 group"
          >
            <div className="p-2 bg-rose-400/10 rounded-lg group-hover:bg-rose-400/20 transition-colors">
              <ThemedIcon icon={FaUser} className="w-5 h-5 text-rose-400" />
            </div>
            <span className="font-medium tracking-wide">Orders</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-4 hover:bg-red-500/10 p-3 rounded-xl transition-all duration-300 group mt-6"
          >
            <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
              <ThemedIcon icon = {FaSignOutAlt} className="w-5 h-5 text-red-400 group-hover:text-red-500" />
            </div>
            <span className="font-medium tracking-wide text-red-400 group-hover:text-red-500">
              Logout
            </span>
          </button>
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm md:hidden z-20"
        ></div>
      )}
    </div>
  );
};

export default SideBar;