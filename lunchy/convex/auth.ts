import { mutation } from "./_generated/server";
import { v } from "convex/values";

// In production, you would integrate Twilio or Hubtel for Ghanaian SMS delivery!
export const sendPhoneOTP = mutation({
  args: { phone: v.string() },
  handler: async (ctx, args) => {
    // Generate a simple 4-digit code (e.g. 1234 for testing)
    const mockOtp = "1234";
    
    // Save code with 5-minute expiration timestamp
    await ctx.db.insert("phoneVerifications", {
      phone: args.phone,
      code: mockOtp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    return { success: true, message: "Verification code sent!" };
  },
});

export const verifyPhoneOTP = mutation({
  args: { phone: v.string(), code: v.string() },
  handler: async (ctx, args) => {
    // For demo purposes, "1234" always works
    if (args.code === "1234") {
      return { verified: true };
    }
    
    return { verified: false, error: "Invalid code. Try 1234!" };
  },
});