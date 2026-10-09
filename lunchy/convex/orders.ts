import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createOrder = mutation({
  args: {
    vendorId: v.id("vendors"),
    items: v.array(
      v.object({
        menuItemId: v.id("menuItems"),
        quantity: v.number(),
        priceAtOrder: v.number(),
      })
    ),
    totalAmount: v.number(),
    deliveryDate: v.string(), // "YYYY-MM-DD"
    deliveryAddress: v.object({
      buildingName: v.string(),
      landmark: v.optional(v.string()),
      areaZone: v.literal("Ministries, Accra"),
    }),
    userPhone: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Fetch vendor to verify current cutoff time
    const vendor = await ctx.db.get(args.vendorId);
    if (!vendor || !vendor.isActive) {
      throw new Error("This vendor is currently not accepting pre-orders.");
    }

    // 2. Insert the new order into the Convex database
    const orderId = await ctx.db.insert("orders", {
      userId: "guest_user", // We can replace this with real Auth ID later!
      vendorId: args.vendorId,
      items: args.items,
      totalAmount: args.totalAmount,
      deliveryDate: args.deliveryDate,
      deliveryAddress: args.deliveryAddress,
      status: "pending",
      createdAt: Date.now(),
    });

    return orderId;
  },
});