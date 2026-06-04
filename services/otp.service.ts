import crypto from "crypto";
import bcrypt from "bcryptjs";
import OTP from "@/models/otp";
import User from "@/models/User";
import { connectDB } from "@/lib/db/mongoose";
import { sendEmail, getOtpEmailTemplate } from "@/lib/email";

const OTP_EXPIRY_MINUTES = 5;
const COOLDOWN_SECONDS = 60;

/**
 * Generate a cryptographically secure 6-digit numeric OTP.
 */
function generateOTP(): string {
  // Generate a random integer between 100000 and 999999
  const otpVal = crypto.randomInt(100000, 1000000);
  return otpVal.toString();
}

interface GenerateSignupOtpParams {
  email: string;
  name: string;
  username: string;
  passwordHash: string;
}

/**
 * Validates availability of email/username, checks cooldown, generates, hashes, and sends signup OTP.
 */
export async function generateAndSendSignupOtp({
  email,
  name,
  username,
  passwordHash,
}: GenerateSignupOtpParams): Promise<{ success: boolean; message: string; cooldownRemaining?: number }> {
  await connectDB();

  // 1. Validate if user already exists
  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
  });

  if (existingUser) {
    if (existingUser.email === email.toLowerCase()) {
      return { success: false, message: "EMAIL_EXISTS" };
    }
    if (existingUser.username === username.toLowerCase()) {
      return { success: false, message: "USERNAME_EXISTS" };
    }
  }

  // 2. Check cooldown on existing active OTP
  const latestOtp = await OTP.findOne({
    email: email.toLowerCase(),
    type: "signup",
    used: false,
  }).sort({ createdAt: -1 });

  if (latestOtp) {
    const elapsedSeconds = Math.floor((Date.now() - latestOtp.createdAt.getTime()) / 1000);
    if (elapsedSeconds < COOLDOWN_SECONDS) {
      return {
        success: false,
        message: "COOLDOWN_ACTIVE",
        cooldownRemaining: COOLDOWN_SECONDS - elapsedSeconds,
      };
    }
    // Purge old active OTPs for this user & type to avoid duplication
    await OTP.deleteMany({ email: email.toLowerCase(), type: "signup", used: false });
  }

  // 3. Generate new OTP & details
  const otpCode = generateOTP();
  const salt = await bcrypt.genSalt(12);
  const otpHash = await bcrypt.hash(otpCode, salt);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // 4. Store securely with pending signup payload
  await OTP.create({
    email: email.toLowerCase(),
    otpHash,
    expiresAt,
    type: "signup",
    used: false,
    name,
    username: username.toLowerCase(),
    passwordHash,
  });

  // 5. Send Email
  const emailHtml = getOtpEmailTemplate({
    name,
    otpCode,
    expiryMinutes: OTP_EXPIRY_MINUTES,
    purpose: "signup",
  });

  const mailSent = await sendEmail({
    to: email,
    subject: "Verify Your B Smart Finance Account Signup",
    html: emailHtml,
  });

  if (!mailSent) {
    return { success: false, message: "Failed to send verification email" };
  }

  return { success: true, message: "OTP sent successfully" };
}

/**
 * Generates, hashes, and sends login OTP for an existing user.
 */
export async function generateAndSendLoginOtp(
  email: string
): Promise<{ success: boolean; message: string; cooldownRemaining?: number }> {
  await connectDB();

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.isActive) {
    return { success: false, message: "Invalid email or password" };
  }

  // Check cooldown on existing active OTP
  const latestOtp = await OTP.findOne({
    email: email.toLowerCase(),
    type: "login",
    used: false,
  }).sort({ createdAt: -1 });

  if (latestOtp) {
    const elapsedSeconds = Math.floor((Date.now() - latestOtp.createdAt.getTime()) / 1000);
    if (elapsedSeconds < COOLDOWN_SECONDS) {
      return {
        success: false,
        message: "COOLDOWN_ACTIVE",
        cooldownRemaining: COOLDOWN_SECONDS - elapsedSeconds,
      };
    }
    // Purge old active OTPs for this user & type
    await OTP.deleteMany({ email: email.toLowerCase(), type: "login", used: false });
  }

  // Generate new OTP
  const otpCode = generateOTP();
  const salt = await bcrypt.genSalt(12);
  const otpHash = await bcrypt.hash(otpCode, salt);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await OTP.create({
    email: email.toLowerCase(),
    otpHash,
    expiresAt,
    type: "login",
    used: false,
  });

  const emailHtml = getOtpEmailTemplate({
    name: user.name,
    otpCode,
    expiryMinutes: OTP_EXPIRY_MINUTES,
    purpose: "login",
  });

  const mailSent = await sendEmail({
    to: email,
    subject: "Verify Your B Smart Finance Login",
    html: emailHtml,
  });

  if (!mailSent) {
    return { success: false, message: "Failed to send verification email" };
  }

  return { success: true, message: "OTP sent successfully" };
}

interface VerifyOtpResult {
  success: boolean;
  message: string;
  userData?: {
    _id: string;
    name: string;
    username: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

/**
 * Verify signup OTP and physically create the user account in the database.
 */
export async function verifySignupOtp(email: string, code: string): Promise<VerifyOtpResult> {
  await connectDB();

  const otpDoc = await OTP.findOne({
    email: email.toLowerCase(),
    type: "signup",
    used: false,
  }).sort({ createdAt: -1 });

  if (!otpDoc) {
    return { success: false, message: "Verification code not found or already verified" };
  }

  // Check expiry
  if (Date.now() > otpDoc.expiresAt.getTime()) {
    return { success: false, message: "Verification code has expired" };
  }

  // Verify hash
  const isValid = await bcrypt.compare(code, otpDoc.otpHash);
  if (!isValid) {
    return { success: false, message: "Invalid verification code" };
  }

  // Verify if details exist
  if (!otpDoc.name || !otpDoc.username || !otpDoc.passwordHash) {
    return { success: false, message: "Invalid verification state. Please sign up again." };
  }

  // Prevent race conditions: check if username/email was taken while waiting for OTP
  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username: otpDoc.username.toLowerCase() }],
  });

  if (existingUser) {
    return { success: false, message: "Username or email is already in use" };
  }

  // Mark OTP as used and delete it to prevent reuse
  otpDoc.used = true;
  await otpDoc.save();
  await OTP.deleteMany({ email: email.toLowerCase(), type: "signup" });

  // Create user
  const user = await User.create({
    name: otpDoc.name,
    username: otpDoc.username,
    email: email.toLowerCase(),
    password: otpDoc.passwordHash,
    role: "user",
    emailVerified: true,
  });

  return {
    success: true,
    message: "Email verified and account created successfully",
    userData: {
      _id: String(user._id),
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  };
}

/**
 * Verify login OTP for an existing user.
 */
export async function verifyLoginOtp(email: string, code: string): Promise<VerifyOtpResult> {
  await connectDB();

  const otpDoc = await OTP.findOne({
    email: email.toLowerCase(),
    type: "login",
    used: false,
  }).sort({ createdAt: -1 });

  if (!otpDoc) {
    return { success: false, message: "Verification code not found or already verified" };
  }

  // Check expiry
  if (Date.now() > otpDoc.expiresAt.getTime()) {
    return { success: false, message: "Verification code has expired" };
  }

  // Verify hash
  const isValid = await bcrypt.compare(code, otpDoc.otpHash);
  if (!isValid) {
    return { success: false, message: "Invalid verification code" };
  }

  // Find user
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.isActive) {
    return { success: false, message: "User account is suspended or not found" };
  }

  // Mark OTP as used and delete it
  otpDoc.used = true;
  await otpDoc.save();
  await OTP.deleteMany({ email: email.toLowerCase(), type: "login" });

  return {
    success: true,
    message: "Login verified successfully",
    userData: {
      _id: String(user._id),
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  };
}

/**
 * Enforces cooldown checks and resends OTP of specific type.
 */
export async function resendOtpCode(
  email: string,
  type: "signup" | "login"
): Promise<{ success: boolean; message: string; cooldownRemaining?: number }> {
  await connectDB();

  // Find current pending OTP details
  const pendingOtp = await OTP.findOne({
    email: email.toLowerCase(),
    type,
    used: false,
  }).sort({ createdAt: -1 });

  if (!pendingOtp) {
    return { success: false, message: "No active verification request found for this email. Please submit the form again." };
  }

  const elapsedSeconds = Math.floor((Date.now() - pendingOtp.createdAt.getTime()) / 1000);
  if (elapsedSeconds < COOLDOWN_SECONDS) {
    return {
      success: false,
      message: "COOLDOWN_ACTIVE",
      cooldownRemaining: COOLDOWN_SECONDS - elapsedSeconds,
    };
  }

  // Keep pending signup details if it's signup type
  const { name, username, passwordHash } = pendingOtp;

  // Purge old active OTPs for this user & type
  await OTP.deleteMany({ email: email.toLowerCase(), type, used: false });

  // Generate new
  const otpCode = generateOTP();
  const salt = await bcrypt.genSalt(12);
  const otpHash = await bcrypt.hash(otpCode, salt);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await OTP.create({
    email: email.toLowerCase(),
    otpHash,
    expiresAt,
    type,
    used: false,
    name,
    username,
    passwordHash,
  });

  const emailHtml = getOtpEmailTemplate({
    name: name || "User",
    otpCode,
    expiryMinutes: OTP_EXPIRY_MINUTES,
    purpose: type,
  });

  const mailSent = await sendEmail({
    to: email,
    subject: type === "signup" ? "Verify Your B Smart Finance Account Signup" : "Verify Your B Smart Finance Login",
    html: emailHtml,
  });

  if (!mailSent) {
    return { success: false, message: "Failed to send verification email" };
  }

  return { success: true, message: "OTP resent successfully" };
}
