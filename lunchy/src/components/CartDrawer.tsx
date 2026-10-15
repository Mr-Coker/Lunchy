import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { X, Trash2, ShoppingBag, ArrowRight, Building, MapPin, Phone } from "lucide-react";
import { type MenuItem } from "./MenuFeed";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: MenuItem[];
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

export const CartDrawer = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) => {
  // Call Convex mutation hook at the top level of the component
  const createOrder = useMutation(api.orders.createOrder);

  const [buildingName, setBuildingName] = useState("");
  const [landmark, setLandmark] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Calculate Subtotal & Delivery Fee
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const serviceCharge = cartItems.length > 0 ? 5 : 0; // Flat 5 rate for Ministries area
  const total = subtotal + serviceCharge;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!buildingName.trim() || !phone.trim()) {
      alert("Please provide your building name and phone number for delivery.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Calculate next day's date in YYYY-MM-DD format
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const deliveryDate = tomorrow.toISOString().split("T")[0];

      await createOrder({
        vendorId: (cartItems[0].vendorId || cartItems[0].id) as Id<"vendors">,
        items: cartItems.map((item) => ({
          menuItemId: item.id as Id<"menuItems">,
          quantity: 1,
          priceAtOrder: item.price,
        })),
        totalAmount: total,
        deliveryDate,
        deliveryAddress: {
          buildingName: buildingName.trim(),
          landmark: landmark.trim() || undefined,
          areaZone: "Ministries, Accra",
        },
        userPhone: phone.trim(),
      });

      alert("Pre-order placed successfully!");
      onClearCart();
      onClose();
    } catch (error) {
      console.error("Order error:", error);
      alert(error instanceof Error ? error.message : "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet Container */}
      <div className="fixed inset-x-0 bottom-0 z-50 max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300">
        
        {/* Mobile Drag Indicator Handle */}
        <div className="w-full flex justify-center pt-3 pb-1" onClick={onClose}>
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>

        {/* Drawer Header */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-slate-800 text-base">Your Order Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-medium text-slate-600 text-sm">Your cart is empty</p>
              <p className="text-xs text-slate-400">Add some delicious meals from the menu!</p>
            </div>
          ) : (
            <>
              {/* Cart Selected Items List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Selected Meals ({cartItems.length})
                </h3>
                {cartItems.map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 text-xs truncate">{item.name}</h4>
                        <span className="text-[11px] text-slate-500 block">{item.vendorName}</span>
                        <span className="font-bold text-slate-900 text-xs">
                          GH₵ {item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-slate-400 hover:text-red-500 p-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Delivery Location Details Form */}
              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Delivery Details (Ministries Area)
                </h3>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Building / Office Name *
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ministry of Finance, Block B"
                      value={buildingName}
                      onChange={(e) => setBuildingName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Landmark (Optional)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Near Accra Sports Stadium"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 024 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 bg-slate-50/50"
                    />
                  </div>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Bottom Sheet Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3 rounded-b-3xl">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>GH₵ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Charge (Ministries)</span>
                <span>GH₵ {serviceCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-200">
                <span>Total Amount</span>
                <span className="text-orange-600">GH₵ {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm transition-transform active:scale-[0.98]"
            >
              <span>{isSubmitting ? "Placing Order..." : "Confirm Next-Day Pre-Order"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};