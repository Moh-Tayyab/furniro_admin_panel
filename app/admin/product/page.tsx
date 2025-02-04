"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAtom } from "jotai";
import { data } from "@/DataFetching";
import { Product } from "@/interface";

export default function AdminPanel() {
  const [products, setProducts] = useAtom(data);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Added loading state
  const router = useRouter();

  useEffect(() => {
    setFilteredProducts(products);
    setLoading(false); // Simulate data loading completion
  }, [products]);

  // Debounced search for suggestions
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.categoryName || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, products]);

  const handleSuggestionClick = (product: Product) => {
    setSearchQuery(product.name);
    setShowSuggestions(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        (product.categoryName || "").toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 md:ml-64 z-10 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col gap-4 md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 pt-14">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 font-[Poppins] tracking-tight">
              Product Management
            </h1>
            <div className="flex flex-col md:flex-row items-stretch gap-3 w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search products..."
                  className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-3 bg-white/90 border border-gray-200 rounded-lg md:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <svg
                  className="absolute left-3 md:left-4 top-2.5 md:top-3.5 h-4 w-4 md:h-5 md:w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {/* Search Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg md:rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((product) => (
                      <div
                        key={product.id}
                        className="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-all duration-200"
                        onMouseDown={() => handleSuggestionClick(product)}
                      >
                        <p className="text-gray-700 font-medium">
                          {product.name.split(new RegExp(`(${searchQuery})`, "i")).map((part, index) =>
                            part.toLowerCase() === searchQuery.toLowerCase() ? (
                              <span key={index} className="text-purple-500">{part}</span>
                            ) : (
                              <span key={index}>{part}</span>
                            )
                          )}
                        </p>
                        <p className="text-sm text-gray-500">{product.categoryName || "Uncategorized"}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-sm md:text-base flex items-center justify-center gap-1.5"
              >
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 md:h-96 rounded-xl md:rounded-2xl bg-white/50 backdrop-blur-sm">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-sm md:text-base text-gray-600 font-medium">Loading Products...</p>
              <p className="text-xs md:text-sm text-gray-400 mt-1">Please wait while we fetch your data</p>
            </div>
          ) : (
            /* Products Table */
            <div className="bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg overflow-x-auto border border-gray-100">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gradient-to-r from-purple-500 to-blue-400">
                  <tr>
                    {["Image", "Name", "Category", "Price", "Stock", "Rating"].map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 md:px-6 md:py-5 text-left text-white font-semibold text-xs md:text-sm uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50/80 transition-colors duration-200 group"
                      >
                        <td className="px-4 py-2 md:px-6 md:py-4">
                          <div className="h-10 w-10 md:h-14 md:w-14 rounded-lg overflow-hidden border border-white shadow-sm relative">
                            <Image
                              src={product.imageUrl || "/placeholder.jpg"}
                              alt={product.name}
                              layout="fill"
                              objectFit="cover"
                              className="group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-2 md:px-6 md:py-4 font-medium text-gray-800 text-sm md:text-base">
                          {product.name}
                        </td>
                        <td className="px-4 py-2 md:px-6 md:py-4">
                          <span className="px-2 py-1 md:px-3 md:py-1 bg-purple-100 text-purple-800 rounded-full text-xs md:text-sm">
                            {product.categoryName || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-4 py-2 md:px-6 md:py-4 font-semibold text-blue-600 text-sm md:text-base">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 md:px-6 md:py-4">
                          <div className="flex items-center">
                            <span className="mr-2 text-xs md:text-sm">{product.stock}</span>
                            <div className="hidden md:block h-2 w-20 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500"
                                style={{ width: `${(product.stock / 100) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2 md:px-6 md:py-4">
                          <div className="flex items-center text-sm md:text-base">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span className="font-medium">
                              {product.rating.rate || "N/A"}
                            </span>
                            <span className="text-gray-400 ml-1 text-xs md:text-sm">
                              ({product.rating.count || 0})
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 md:py-24 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <svg
                            className="w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-lg md:text-xl font-medium">No products found</p>
                          <p className="mt-1 text-xs md:text-sm">Try adjusting your search criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}