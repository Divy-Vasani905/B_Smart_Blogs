import User, { IUserDocument } from "@/models/User";
import { connectDB } from "@/lib/db/mongoose";
import { hashPassword } from "@/lib/auth/password";
import type { SignupInput } from "@/lib/validations/auth.schema";

export async function createUser(data: SignupInput): Promise<IUserDocument> {
  await connectDB();

  const exists = await User.findOne({ 
    $or: [{ email: data.email }, { username: data.username }] 
  }).lean();
  
  if (exists) {
    if (exists.email === data.email) throw new Error("EMAIL_EXISTS");
    if (exists.username === data.username) throw new Error("USERNAME_EXISTS");
  }

  const hashed = await hashPassword(data.password);
  const user = await User.create({
    name: data.name,
    username: data.username,
    email: data.email,
    password: hashed,
    role: "user",
  });

  return user;
}

export async function getUserByEmail(email: string): Promise<IUserDocument | null> {
  await connectDB();
  // Note: +password selects the password field that's excluded by default
  return User.findOne({ email }).select("+password").lean() as Promise<IUserDocument | null>;
}

export async function getUserById(id: string): Promise<IUserDocument | null> {
  await connectDB();
  return User.findById(id).lean() as Promise<IUserDocument | null>;
}

export async function updateUserProfile(
  id: string,
  data: { name?: string; bio?: string; avatar?: string }
): Promise<IUserDocument | null> {
  await connectDB();
  return User.findByIdAndUpdate(id, data, { new: true }).lean() as Promise<IUserDocument | null>;
}
