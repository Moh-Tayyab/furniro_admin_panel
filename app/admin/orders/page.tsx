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
	const [sortBy, setSortBy] = useState<string>("orderDate"); // Default sorting by orderDate
  
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
  
	// Sort function based on sortBy
	const sortedOrders = [...orders].sort((a, b) => {
	  const aValue = a[sortBy as keyof Order];
	  const bValue = b[sortBy as keyof Order];
  
	  if (aValue < bValue) return -1;
	  if (aValue > bValue) return 1;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 md:ml-64">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent mb-2">
            Order Management
            <span className="ml-4">📦</span>
          </h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>

        {/* Control Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            /> 
            <ThemedIcon
            icon={FaSearch} 
            className="absolute left-4 top-4 text-gray-400" />
          </div>

          <div className="relative">
            <select
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
            </select>
            <ThemedIcon
              icon ={FaFilter} 
            className="absolute left-4 top-4 text-gray-400" />
          </div>

          <select
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="orderDate">Sort by Date</option>
            <option value="totalAmount">Sort by Amount</option>
            <option value="orderId">Sort by Order ID</option>
            <option value="customer">Sort by Customer</option>
          </select>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 backdrop-blur-sm rounded-2xl bg-white/50">
            <ThemedIcon
            icon={FaSpinner}
             className="animate-spin text-blue-500 mb-4 w-8 h-8"/>
            <p className="text-gray-600 font-medium">Loading Orders...</p>
            <p className="text-sm text-gray-400 mt-2">Please wait while we fetch your data</p>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-teal-500 text-white">
                <tr>
                  {["Order ID", "Customer", "Status", "Items", "Quantity", "Date", "Amount", "Address"].map((header) => (
                    <th key={header} className="px-6 py-4 text-left text-sm font-semibold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-blue-600">{order.orderId}</td>
                    <td className="px-6 py-4">{order.customer?.fullName || "Guest"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "pending" 
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">{order.items.length}</td>
                    <td className="px-6 py-4 text-center">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(order.orderDate).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                      {order.shippingAddress}
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <svg
                          className="w-20 h-20 mb-4"
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
                        <p className="text-xl font-medium">No orders found</p>
                        <p className="mt-1 text-sm">Try adjusting your search criteria</p>
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