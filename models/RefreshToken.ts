import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IRefreshTokenDocument extends Document {
  tokenHash: string; // bcrypt hash of the token for secure storage
  user: Types.ObjectId;
  expiresAt: Date;
  isRevoked: boolean;
  userAgent: string;
  ip: string;
  createdAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshTokenDocument>(
  {
    tokenHash: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // MongoDB TTL index — auto-deletes expired tokens
    },
    isRevoked: { type: Boolean, default: false },
    userAgent: { type: String, default: "" },
    ip: { type: String, default: "" },
  },
  { timestamps: true }
);

const RefreshToken: Model<IRefreshTokenDocument> =
  (mongoose.models.RefreshToken as Model<IRefreshTokenDocument>) ||
  mongoose.model<IRefreshTokenDocument>("RefreshToken", RefreshTokenSchema);

export default RefreshToken;
