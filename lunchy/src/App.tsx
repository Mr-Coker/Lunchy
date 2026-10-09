import { useState } from "react";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { MenuFeed, type MenuItem } from "./components/MenuFeed";
import { CartDrawer } from "./components/CartDrawer";

export default function App() {
  const [activeTab, setActiveTab] = useState("menu");
  const [cartItems, setCartItems] = useState<MenuItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (item: MenuItem) => {
    setCartItems((prev) => [...prev, item]);
  };

  const handleRemoveFromCart = (indexToRemove: number) => {
    setCartItems((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Mobile Header */}
      <Header
        cartCount={cartItems.length}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-md mx-auto px-4 py-4">
        {activeTab === "menu" || activeTab === "preorder" ? (
          <MenuFeed onAddToCart={handleAddToCart} />
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-500">
            <p className="text-sm">Section under development...</p>
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCartItems([])}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
