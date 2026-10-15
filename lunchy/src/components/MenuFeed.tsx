import { useState } from "react";
import { Plus, Clock, ChefHat } from "lucide-react";

// Types for our menu items
export interface MenuItem {
  id: string;
  name: string;
  vendorName: string;
  vendorId?: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  cutoffTime: string;
}

interface MenuFeedProps {
  onAddToCart: (item: MenuItem) => void;
}

// Temporary sample data for Accra local delicacies
const SAMPLE_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "Special Waakye Combo",
    vendorName: "Auntie Muni Kitchen",
    description: "Waakye with fried plantain, boiled egg, spaghetti, wele, and shito.",
    price: 45,
    category: "Main",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    cutoffTime: "21:00",
  },
  {
    id: "2",
    name: "Assorted Jollof Rice",
    vendorName: "Ridge Royal Eats",
    description: "Smokey Ghanaian Jollof served with grilled chicken piece and coleslaw.",
    price: 50,
    category: "Main",
    imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80",
    cutoffTime: "22:00",
  },
  {
    id: "3",
    name: "Banku with Tilapia",
    vendorName: "Osu Night Market Delights",
    description: "Two hot banku balls served with whole grilled tilapia and hot pepper sauce.",
    price: 65,
    category: "Main",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
    cutoffTime: "20:30",
  },
  {
    id: "4",
    name: "Chilled Sobolo (500ml)",
    vendorName: "Fresh Drinks Co.",
    description: "Hibiscus drink infused with local spices, ginger, and pineapple.",
    price: 15,
    category: "Drinks",
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    cutoffTime: "23:00",
  },
];

const CATEGORIES = ["All", "Main", "Sides", "Drinks"];

export const MenuFeed = ({ onAddToCart }: MenuFeedProps) => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredItems = selectedCategory === "All"
    ? SAMPLE_ITEMS
    : SAMPLE_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Pre-Order Banner Notice */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-2 bg-orange-500 text-white rounded-xl mt-0.5">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-orange-950 text-sm">Tomorrow's Lunch Delivery</h3>
          <p className="text-xs text-orange-800 mt-0.5">
            Place your order before the vendor cutoff time (max 11:00 PM tonight) to secure delivery in Ministries.
          </p>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Menu Cards Grid */}
      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm flex gap-3.5 items-center hover:border-slate-200 transition-all"
          >
            {/* Meal Image */}
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-24 h-24 rounded-xl object-cover bg-slate-100 flex-shrink-0"
            />

            {/* Meal Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mb-0.5">
                <ChefHat className="w-3.5 h-3.5 text-orange-500" />
                <span className="truncate">{item.vendorName}</span>
              </div>
              
              <h4 className="font-bold text-slate-900 text-sm truncate">{item.name}</h4>
              <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{item.description}</p>
              
              <div className="flex items-center justify-between mt-2">
                <span className="font-extrabold text-slate-900 text-sm">
                  GH₵ {item.price.toFixed(2)}
                </span>
                
                <button
                  onClick={() => onAddToCart(item)}
                  className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-transform active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};