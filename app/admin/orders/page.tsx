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
      <div className="relative">
        <input
          type="text"
          className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-3 bg-white border border-gray-200 rounded-lg md:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        /> 
        <ThemedIcon
          icon={FaSearch} 
          className="absolute left-3 md:left-4 top-2.5 md:top-3.5 text-gray-400 w-4 h-4 md:w-5 md:h-5"
        />
      </div>

      <div className="relative">
        <select
          className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-3 bg-white border border-gray-200 rounded-lg md:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-sm md:text-base"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
             <option value="orderDate">Sort by Date</option>
            <option value="totalAmount">Sort by Amount</option>
            <option value="orderId">Sort by Order ID</option>
            <option value="customer">Sort by Customer</option>
        </select>
        <ThemedIcon
          icon={FaFilter} 
          className="absolute left-3 md:left-4 top-2.5 md:top-3.5 text-gray-400 w-4 h-4 md:w-5 md:h-5"
        />
      </div>

      <select
        className="w-full px-4 py-2 md:py-3 bg-white border border-gray-200 rounded-lg md:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
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
      <div className="flex flex-col items-center justify-center h-64 md:h-96 rounded-xl md:rounded-2xl bg-white/50">
        <ThemedIcon
          icon={FaSpinner}
          className="animate-spin text-blue-500 mb-3 w-6 h-6 md:w-8 md:h-8"
        />
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