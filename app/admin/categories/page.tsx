"use client";

import { data } from "@/DataFetching";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import {
  FaChair,
  FaUtensils,
  FaTable,
  FaLightbulb,
  FaBoxOpen,
  FaDollarSign,
} from "react-icons/fa";

// Add type definition for CategoryTheme
type CategoryTheme = {
  icon: JSX.Element;
  bg: string;
  progress: string;
};

// Define valid category keys as a type
type CategoryKey = "chairs" | "cutlery" | "tables" | "decoration" | "default";
// Move the ThemedIcon component outside the main component
const ThemedIcon = ({
  icon: Icon,
  className,
}: {
  icon: React.ElementType;
  className?: string;
}) => <Icon className={className || ""} />;
const Categories = () => {
  const [products] = useAtom(data);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [categoryWiseAmount, setCategoryWiseAmount] = useState<any>({});

  // Update categoryThemes with type annotation
  const categoryThemes: Record<CategoryKey, CategoryTheme> = {
    chairs: {
      icon: <ThemedIcon icon={FaChair} className="w-8 h-8 text-teal-600" />,
      bg: "bg-teal-50",
      progress: "bg-gradient-to-r from-teal-400 to-emerald-400",
    },
    cutlery: {
      icon: <ThemedIcon icon={FaUtensils} className="w-8 h-8 text-blue-600" />,
      bg: "bg-blue-50",
      progress: "bg-gradient-to-r from-blue-400 to-cyan-400",
    },
    tables: {
      icon: <ThemedIcon icon={FaTable} className="w-8 h-8 text-amber-600" />,
      bg: "bg-amber-50",
      progress: "bg-gradient-to-r from-amber-400 to-orange-400",
    },
    decoration: {
      icon: <ThemedIcon icon={FaLightbulb} className="w-8 h-8 text-pink-600" />,
      bg: "bg-pink-50",
      progress: "bg-gradient-to-r from-pink-400 to-rose-400",
    },
    default: {
      icon: <ThemedIcon icon={FaBoxOpen} className="w-8 h-8 text-gray-600" />,
      bg: "bg-gray-50",
      progress: "bg-gradient-to-r from-gray-400 to-slate-400",
    },
  };

  useEffect(() => {
    let total = 0;
    let totalQuantity = 0;
    let categoryAmounts: { [key: string]: number } = {};

    products.forEach((product) => {
      total += product.stock * product.price;
      totalQuantity += product.stock;

      if (categoryAmounts[product.categoryName]) {
        categoryAmounts[product.categoryName] += product.stock * product.price;
      } else {
        categoryAmounts[product.categoryName] = product.stock * product.price;
      }
    });

    setTotalAmount(total);
    setTotalStock(totalQuantity);
    setCategoryWiseAmount(categoryAmounts);
  }, [products]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col items-center p-6 md:ml-64">
      <div className="w-full max-w-6xl space-y-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-6">
            Inventory Analytics
            <span className="ml-4 text-2xl">📊</span>
          </h1>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="bg-gradient-to-br from-teal-500 to-blue-500 p-6 rounded-2xl shadow-lg flex items-center gap-4 backdrop-blur-sm">
              <div className="p-3 bg-white/20 rounded-full">
                <ThemedIcon
                  icon={FaDollarSign}
                  className="w-8 h-8 text-white"
                />
              </div>
              <div>
                <p className="text-sm text-white/80">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-white">
                  €
                  {totalAmount.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl shadow-lg flex items-center gap-4 backdrop-blur-sm">
              <div className="p-3 bg-white/20 rounded-full">
                <ThemedIcon icon={FaBoxOpen} className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/80">Total Inventory Units</p>
                <p className="text-2xl font-bold text-white">
                  {totalStock.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(categoryWiseAmount).map(([category, amount]) => {
            // Update the theme access with type safety
            const theme =
              categoryThemes[category.toLowerCase() as CategoryKey] ||
              categoryThemes.default;
            const percentage = (
              ((amount as number) / totalAmount) *
              100
            ).toFixed(1);

            return (
              <div
                key={category}
                className={`${theme.bg} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group`}>
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-white/20">{theme.icon}</div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/30">
                    <span className="text-sm font-semibold text-gray-700">
                      {percentage}%
                    </span>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mt-4 mb-1">
                  {category.toUpperCase()}
                </h3>
                <p className="text-2xl font-bold text-gray-700 mb-4">
                  $
                  {(amount as number).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>
                <div className="relative">
                  <div className="w-full bg-white/30 rounded-full h-3">
                    <div
                      className={`${theme.progress} h-3 rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {Object.keys(categoryWiseAmount).length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="inline-block p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100">
              <div className="animate-bounce-slow">
                <ThemedIcon icon={FaBoxOpen} className="w-8 h-8 text-white" />
              </div>
              <p className="text-xl font-semibold text-gray-600">
                Inventory Dashboard Empty
              </p>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                Add products to unlock powerful inventory insights and visual
                analytics
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
