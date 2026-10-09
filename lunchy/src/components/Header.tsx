import { MapPin, ShoppingBag } from "lucide-react";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export const Header = ({ cartCount, onCartClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 shadow-sm">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Delivery Location Indicator */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-orange-100 rounded-full text-orange-600">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Delivering to</span>
            <div className="flex items-center gap-1 font-bold text-slate-800 text-sm">
              <span>Ministries, Accra</span>
            </div>
          </div>
        </div>

        {/* Cart Icon Button with Badge */}
        <button
          onClick={onCartClick}
          className="relative p-2.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-700"
          aria-label="View Cart"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};