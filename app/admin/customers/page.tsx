"use client";

import { client } from "@/sanity/lib/client";
import { useEffect, useState } from "react";
import { FaSpinner, FaSearch, FaUser } from "react-icons/fa";

const ThemedIcon = ({ icon: Icon, className }: { icon: React.ElementType; className?: string }) => (

	<Icon className={className || ''} />
  );
  
  interface Customer {
	_id: string;
	fullName: string;
	email: string;
	phoneNumber: string;
	address: string;
	city: string;
  }
export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Customer[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const query = `*[_type == "customer"]{
          _id,
          fullName,
          email,
          phoneNumber,
          address,
          city
        }`;
        const data = await client.fetch(query);
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 ml-0 md:ml-64">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent mb-2 pt-14">
          Customer Directory
        </h1>
        <p className="text-gray-600">Manage and view all customer information</p>
      </div>
  
      {/* Search Bar */}
      <div className="mb-8 relative">
        <div className="relative max-w-xl">
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Fixed FaSearch usage */}
          <ThemedIcon 
            icon={FaSearch} 
            className="absolute left-4 top-4 text-gray-400" 
          />
        </div>
      </div>
  
      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-96 rounded-2xl bg-white/50 backdrop-blur-sm">
          {/* Fixed FaSpinner usage */}
          <ThemedIcon 
            icon={FaSpinner} 
            className="animate-spin text-indigo-500 mb-4 w-10 h-10" 
          />
          <p className="text-gray-600 font-medium">Loading Customers</p>
          <p className="text-sm text-gray-400 mt-2">Fetching customer records...</p>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Make the table horizontally scrollable on small screens */}
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* ... rest of the table remains the same ... */}
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        {/* Fixed FaUser usage */}
                        <ThemedIcon 
                          icon={FaUser} 
                          className="w-16 h-16 mb-4" 
                        />
                        <p className="text-xl font-medium">No customers found</p>
                        <p className="mt-1 text-sm">Try adjusting your search terms</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  </div>
  
  );
}