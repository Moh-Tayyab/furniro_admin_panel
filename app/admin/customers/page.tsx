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

  // Debounced search for suggestions
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      const filtered = customers.filter(
        (customer) =>
          customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, customers]);

  const handleSuggestionClick = (customer: Customer) => {
    setSearchTerm(customer.fullName || customer.email);
    setShowSuggestions(false);
  };

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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 pt-14 animate-fade-in">
            Customer Directory
          </h1>
          <p className="text-gray-600 animate-fade-in delay-100">Manage and view all customer information</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative animate-fade-in delay-200">
          <div className="relative max-w-xl">
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all hover:shadow-purple-200"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click on suggestions
            />
            <ThemedIcon 
              icon={FaSearch} 
              className="absolute left-4 top-4 text-purple-400" 
            />
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((customer) => (
                  <div
                    key={customer._id}
                    className="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-all duration-200"
                    onMouseDown={() => handleSuggestionClick(customer)} // Use onMouseDown to prevent onBlur from closing the dropdown
                  >
                    <p className="text-gray-700 font-medium">
                      {customer.fullName.split(new RegExp(`(${searchTerm})`, "i")).map((part, index) =>
                        part.toLowerCase() === searchTerm.toLowerCase() ? (
                          <span key={index} className="text-purple-500">{part}</span>
                        ) : (
                          <span key={index}>{part}</span>
                        )
                      )}
                    </p>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 rounded-2xl bg-white/50 backdrop-blur-sm animate-fade-in">
            <ThemedIcon 
              icon={FaSpinner} 
              className="animate-spin text-purple-500 mb-4 w-10 h-10" 
            />
            <p className="text-gray-600 font-medium">Loading Customers</p>
            <p className="text-sm text-gray-400 mt-2">Fetching customer records...</p>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-fade-in delay-300">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-500 to-pink-500">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Full Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Phone Number</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">Address</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">City</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-24 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <ThemedIcon 
                            icon={FaUser} 
                            className="w-16 h-16 mb-4 text-purple-300" 
                          />
                          <p className="text-xl font-medium">No customers found</p>
                          <p className="mt-1 text-sm">Try adjusting your search terms</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <tr key={customer._id} className="hover:bg-purple-50 transition-all duration-200">
                        <td className="px-6 py-4 text-gray-700">{customer.fullName}</td>
                        <td className="px-6 py-4 text-gray-700">{customer.email}</td>
                        <td className="px-6 py-4 text-gray-700">{customer.phoneNumber}</td>
                        <td className="px-6 py-4 text-gray-700">{customer.address}</td>
                        <td className="px-6 py-4 text-gray-700">{customer.city}</td>
                      </tr>
                    ))
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