import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  vendors: defineTable({
    name: v.string(),
    description: v.string(),
    phone: v.string(),
    cutoffTime: v.string(), // "HH:MM" format (e.g., "20:00" or "23:00")
    isActive: v.boolean(),
  }),

  menuItems: defineTable({
    vendorId: v.id("vendors"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    imageUrl: v.optional(v.string()),
    category: v.string(),
  }),

  weeklyMenus: defineTable({
    vendorId: v.id("vendors"),
    deliveryDate: v.string(), // "YYYY-MM-DD"
    menuItemIds: v.array(v.id("menuItems")),
    isPublished: v.boolean(),
  }),

  orders: defineTable({
    userId: v.string(),
    vendorId: v.id("vendors"),
    items: v.array(
      v.object({
        menuItemId: v.id("menuItems"),
        quantity: v.number(),
        priceAtOrder: v.number(),
      })
    ),
    totalAmount: v.number(),
    deliveryDate: v.string(),
    deliveryAddress: v.object({
      buildingName: v.string(),
      landmark: v.optional(v.string()),
      areaZone: v.literal("Ministries, Accra"),
    }),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("out_for_delivery"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    createdAt: v.number(),
  })
    .index("by_vendor", ["vendorId"])
    .index("by_delivery_date", ["deliveryDate"]),

  phoneVerifications: defineTable({
    phone: v.string(),
    code: v.string(),
    expiresAt: v.number(),
  }).index("by_phone", ["phone"]),
});