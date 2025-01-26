"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { data } from "@/DataFetching";
import { useAtom } from "jotai";
import { Product } from "@/interface";

export default function AdminPanel() {
  const [products, setProducts] = useAtom(data);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();


 useEffect(() => {
     setFilteredProducts(products);
 },[])



  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = products.filter((product: any) =>
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
    <div className="relative flex min-h-screen bg-gray-50 overflow-hidden">
    {/* Main Content */}
    <main className="flex-1 p-6 md:ml-64 z-10 overflow-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">PRODUCTS</h1>
  
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search products by name or category..."
          className="w-full p-3 border rounded-lg shadow-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
  
      {/* Products Table */}
      <div className="overflow-auto bg-white shadow-lg rounded-lg">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="p-4 relative">
                    <div className="h-14 w-14 rounded-full overflow-hidden border border-gray-200 relative">
                      <Image
                        src={product.imageUrl || "/placeholder.jpg"}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                      />
                      <div className="absolute bg-gray-300 rounded-full" />
                    </div>
                  </td>
                  <td className="p-4">{product.name}</td>
                  <td className="p-4">{product.categoryName || "Uncategorized"}</td>
                  <td className="p-4">${product.price}</td>
                  <td className="p-4">{product.stock}</td>
                  <td className="p-4">{product.rating.rate || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  </div>
  
  
  );
}