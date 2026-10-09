import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Helper function to validate "HH:MM" format and 23:00 max limit
function isValidCutoffTime(timeStr: string): boolean {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(timeStr)) return false;

  const [hours, minutes] = timeStr.split(":").map(Number);
  // Must not exceed 23:00 (11:00 PM)
  if (hours > 23 || (hours === 23 && minutes > 0)) {
    return false;
  }
  return true;
}

export const setCutoffTime = mutation({
  args: {
    vendorId: v.id("vendors"),
    cutoffTime: v.string(), // Expected format: "20:00" or "23:00"
  },
  handler: async (ctx, args) => {
    // 1. Enforce max cutoff rule on the backend
    if (!isValidCutoffTime(args.cutoffTime)) {
      throw new Error(
        "Invalid cutoff time! Cutoff time cannot exceed 11:00 PM (23:00)."
      );
    }

    // 2. Update vendor cutoff time in database
    await ctx.db.patch(args.vendorId, {
      cutoffTime: args.cutoffTime,
    });
  },
});
