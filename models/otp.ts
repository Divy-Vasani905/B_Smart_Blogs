import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export type OTPType = "signup" | "login";

export interface IOTPDocument extends Document {
  email: string;
  otpHash: string;
  expiresAt: Date;
  type: OTPType;
  used: boolean;
  createdAt: Date;
  // Fields for pending signup
  name?: string;
  username?: string;
  passwordHash?: string;
  // Methods
  compareOTP(otp: string): Promise<boolean>;
}

const OTPSchema = new Schema<IOTPDocument>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    type: { type: String, enum: ["signup", "login"], required: true },
    used: { type: Boolean, default: false },
    // Fields for pending signup
    name: { type: String },
    username: { type: String },
    passwordHash: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        delete (ret as any).otpHash; // never expose hashed otp
        return ret;
      },
    },
  }
);

// Helper to compare plain otp with stored hash
OTPSchema.methods.compareOTP = async function (otp: string): Promise<boolean> {
  return bcrypt.compare(otp, this.otpHash);
};

const OTP: Model<IOTPDocument> =
  (mongoose.models.OTP as Model<IOTPDocument>) || mongoose.model<IOTPDocument>("OTP", OTPSchema);

export default OTP;
