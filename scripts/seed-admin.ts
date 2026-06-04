/**
 * Admin Seed Script
 * Run: npx ts-node --project tsconfig.json scripts/seed-admin.ts
 *
 * Creates the initial admin user in MongoDB.
 * Safe to re-run (skips if admin already exists).
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI!;
const ADMIN_NAME = process.env.ADMIN_SEED_NAME || "B Smart Admin";
const ADMIN_EMAIL = process.env.ADMIN_SEED_EMAIL || "admin@bsmartfinance.com";
const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD || "BSmartAdmin@2024!";

if (!MONGODB_URI) throw new Error("MONGODB_URI not set in .env.local");

const UserSchema = new mongoose.Schema(
  {
    name: String, email: String, password: String,
    role: String, isActive: Boolean, emailVerified: Boolean, loginAttempts: Number,
  },
  { timestamps: true }
);

async function seedAdmin() {
  console.log("🔄 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected\n");

  const User = mongoose.models.User || mongoose.model("User", UserSchema);

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`⚠️  Admin already exists: ${ADMIN_EMAIL}`);
    console.log("   Skipping seed. Delete the user from MongoDB to re-seed.");
    await mongoose.disconnect();
    return;
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: hashed,
    role: "admin",
    isActive: true,
    emailVerified: true,
    loginAttempts: 0,
  });

  console.log("✅ Admin user created successfully!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`   Name    : ${ADMIN_NAME}`);
  console.log(`   Email   : ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log(`   Role    : admin`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("🔐 Admin Login URL: /backstage-b-smart-studio/login");
  console.log("⚠️  Change the password after first login!");

  await mongoose.disconnect();
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
