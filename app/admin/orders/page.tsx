"use client";

import { client } from "@/sanity/lib/client";
import { useEffect, useState } from "react";
import { FaSpinner, FaSearch, FaFilter } from "react-icons/fa";

const ThemedIcon = ({ icon: Icon, className }: { icon: React.ElementType; className?: string }) => (
  <Icon className={className || ''} />
);

interface Order {
  _id: string;
  customer: {
    fullName: string;
  };
  totalAmount: number;
  shippingAddress: string;
  status: string;
  orderDate: string;
  orderId: string;
  items: Array<{
    quantity: number;
  }>;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("orderDate");
  const [suggestions, setSuggestions] = useState<Order[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const query = `*[_type == "order"]{
          _id,
          customer->{
            fullName
          },
          totalAmount,
          status,
          orderDate,
          orderId,
          items,
          shippingAddress,
        }`;
        const data = await client.fetch(query);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Debounced search for suggestions
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      const filtered = orders.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    }, 300); // 300ms debounce delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, orders]);

  const handleSuggestionClick = (order: Order) => {
    setSearchTerm(order.orderId || order.customer.fullName);
    setShowSuggestions(false);
  };

  // Sort function based on sortBy
  const sortedOrders = [...orders].sort((a, b) => {
    if (sortBy === "orderDate") {
      return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
    } else if (sortBy === "totalAmount") {
      return a.totalAmount - b.totalAmount;
    } else if (sortBy === "orderId") {
      return a.orderId.localeCompare(b.orderId);
    } else if (sortBy === "customer") {
      return a.customer.fullName.localeCompare(b.customer.fullName);
    }
    return 0;
  });

  // Filter orders based on search term and status filter
  const filteredOrders = sortedOrders.filter(
    (order) =>
      (order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "" || order.status === statusFilter)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 ml-0 md:ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent mb-2 pt-14">
            Order Management
            <span className="ml-2 md:ml-4 text-2xl">📦</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600">Manage and track all customer orders</p>
        </div>

        {/* Control Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-3 bg-white border border-gray-200 rounded-lg md:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            <ThemedIcon
              icon={FaSearch}
              className="absolute left-3 md:left-4 top-2.5 md:top-3.5 text-gray-400 w-4 h-4 md:w-5 md:h-5"
            />
            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg md:rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((order) => (
                  <div
                    key={order._id}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-all duration-200"
                    onMouseDown={() => handleSuggestionClick(order)}
                  >
                    <p className="text-gray-700 font-medium">
                      {order.orderId.split(new RegExp(`(${searchTerm})`, "i")).map((part, index) =>
                        part.toLowerCase() === searchTerm.toLowerCase() ? (
                          <span key={index} className="text-blue-500">{part}</span>
                        ) : (
                          <span key={index}>{part}</span>
                        )
                      )}
                    </p>
                    <p className="text-sm text-gray-500">{order.customer.fullName}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-3 bg-white border border-gray-200 rounded-lg md:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-sm md:text-base"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Filter by Status</option>
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
            </select>
            <ThemedIcon
              icon={FaFilter}
              className="absolute left-3 md:left-4 top-2.5 md:top-3.5 text-gray-400 w-4 h-4 md:w-5 md:h-5"
            />
          </div>

          {/* Sort By */}
          <select
            className="w-full px-4 py-2 md:py-3 bg-white border border-gray-200 rounded-lg md:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="orderDate">Sort by Order Date</option>
            <option value="totalAmount">Sort by Total Amount</option>
            <option value="orderId">Sort by Order ID</option>
            <option value="customer">Sort by Customer Name</option>
          </select>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 md:h-96 rounded-xl md:rounded-2xl bg-white/50 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-sm md:text-base text-gray-600 font-medium">Loading Orders...</p>
            <p className="text-xs md:text-sm text-gray-400 mt-1">Please wait while we fetch your data</p>
          </div>
        ) : (
          <div className="bg-white/90 rounded-xl md:rounded-2xl shadow-lg overflow-x-auto border border-gray-100">
            <table className="w-full min-w-[800px] md:min-w-0">
              <thead className="bg-gradient-to-r from-blue-600 to-teal-500 text-white">
                <tr>
                  {["Order ID", "Customer", "Status", "Items", "Quantity", "Date", "Amount", "Address"].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-semibold"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-4 py-2 md:px-6 md:py-4 text-sm md:text-base font-medium text-blue-600">
                      {order.orderId}
                    </td>
                    <td className="px-4 py-2 md:px-6 md:py-4 text-sm md:text-base">
                      {order.customer?.fullName || "Guest"}
                    </td>
                    <td className="px-4 py-2 md:px-6 md:py-4">
                      <span className={`inline-flex items-center px-2 py-1 md:px-3 rounded-full text-xs md:text-sm font-medium ${
                        order.status === "pending"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-2 md:px-6 md:py-4 text-center text-sm md:text-base">
                      {order.items.length}
                    </td>
                    <td className="px-4 py-2 md:px-6 md:py-4 text-center text-sm md:text-base">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </td>
                    <td className="px-4 py-2 md:px-6 md:py-4 text-sm md:text-base">
                      {new Date(order.orderDate).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-4 py-2 md:px-6 md:py-4 font-semibold text-sm md:text-base">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 md:px-6 md:py-4 text-xs md:text-sm text-gray-600 max-w-[120px] md:max-w-xs truncate">
                      {order.shippingAddress}
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 md:py-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <svg
                          className="w-16 h-16 md:w-20 md:h-20 mb-3 md:mb-4"
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
                        <p className="text-lg md:text-xl font-medium">No orders found</p>
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
    </div>
  );
}