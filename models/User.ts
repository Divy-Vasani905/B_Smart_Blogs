import mongoose, { Document, Model, Schema } from "mongoose";
import type { UserRole } from "@/types/user.types";

// ── Auth Provider ─────────────────────────────────────────────────────────────
export type AuthProvider = "local" | "google";

export interface IUserDocument extends Document {
  name: string;
  username: string;
  email: string;
  password?: string; // Optional — Google users have no password
  provider: AuthProvider; // "local" for email/password, "google" for OAuth
  googleId?: string; // Google's unique user sub-ID
  role: UserRole;
  avatar?: string;
  bio?: string;
  isActive: boolean;
  emailVerified: boolean;
  loginAttempts: number;
  lockUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must be less than 100 characters"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username must be less than 30 characters"],
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
      index: true,
    },
    // Password is optional — Google OAuth users are created without one
    password: {
      type: String,
      required: false,
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Never return password in queries by default
    },
    // Track how the user authenticated for the first time
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    // Google's unique user ID (the "sub" field from Google ID token)
    googleId: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 500 },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        delete (ret as any).password;
        delete (ret as any).__v;
        delete (ret as any).loginAttempts;
        delete (ret as any).lockUntil;
        return ret;
      },
    },
  }
);

// Additional compound/sparse indexes (field-level index:true handles single-field indexes above)
UserSchema.index({ role: 1 });
UserSchema.index({ googleId: 1 }, { sparse: true }); // Sparse: only index docs that have googleId

// Prevent mongoose from creating duplicate model on hot reloads
const User: Model<IUserDocument> =
  (mongoose.models.User as Model<IUserDocument>) ||
  mongoose.model<IUserDocument>("User", UserSchema);

export default User;
