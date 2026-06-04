"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { RefreshCw, Lock } from "lucide-react";
import { UserRole } from "@/types/user.types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
}

export function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Form states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  // OTP Verification States
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [cooldown, setCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingType, setPendingType] = useState<"signup" | "login">("login");

  // Cooldown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showOtp && cooldown > 0) {
      timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    } else if (cooldown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [showOtp, cooldown]);

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setShowOtp(false);
      setOtpCode("");
      setCooldown(60);
      setCanResend(false);
      setLoginForm({ email: "", password: "" });
      setSignupForm({ name: "", username: "", email: "", password: "" });
    }
  }, [isOpen]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = loginForm;
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Login failed");
        return;
      }

      // Transition to OTP screen
      setPendingEmail(loginForm.email);
      setPendingType("login");
      setShowOtp(true);
      setCooldown(60);
      setCanResend(false);
      toast.success("Verification code sent to your email!");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...signupForm }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Signup failed");
        return;
      }

      // Transition to OTP screen
      setPendingEmail(signupForm.email);
      setPendingType("signup");
      setShowOtp(true);
      setCooldown(60);
      setCanResend(false);
      toast.success("Verification code sent to your email!");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpVerify(e: React.FormEvent) {
    e.preventDefault();
    if (otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail, code: otpCode, type: pendingType }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Verification failed");
        return;
      }

      // Update global auth context state
      login(data.data);

      toast.success(pendingType === "signup" ? "Account created successfully!" : "Welcome back!");
      onClose();

      setTimeout(() => {
        router.refresh();
        if (data.data.role === "admin") {
          router.push("/backstage-b-smart-studio");
        } else {
          router.push("/");
        }
      }, 100);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleModalResend() {
    setCanResend(false);
    setCooldown(60);
    try {
      const res = await fetch("/api/auth/otp/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail, type: pendingType }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error || "Failed to resend code");
        setCanResend(true);
        setCooldown(0);
        return;
      }
      toast.success("Verification code resent successfully!");
    } catch {
      toast.error("Something went wrong");
      setCanResend(true);
      setCooldown(0);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(90%-2rem)] ssm:max-w-[380px] sm:max-w-[380px] p-0 overflow-y-auto max-h-[95vh] sm:max-h-none border-none bg-background/95 backdrop-blur-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl">
        <div className="p-4 sm:p-6">
          <DialogHeader className="mb-2 sm:mb-3">
            <div className="flex justify-center mb-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md transition-transform hover:scale-105">
                <span className="text-white text-base sm:text-lg font-black">B</span>
              </div>
            </div>
            <DialogTitle className="text-base sm:text-xl font-bold text-center tracking-tight bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
              B Smart Finance
            </DialogTitle>
          </DialogHeader>

          {!showOtp ? (
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-2 sm:mb-4 bg-muted/50 p-1 rounded-lg">
                <TabsTrigger
                  value="login"
                  className="rounded-lg py-2 text-xs sm:text-sm data-[state=active]:!bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:!text-white transition-all"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-lg py-2 text-xs sm:text-sm data-[state=active]:!bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:!text-white transition-all"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-2 sm:space-y-2.5">
                  <div className="space-y-0.5">
                    <Label htmlFor="login-email" className="text-[10px] sm:text-xs font-semibold ml-1">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                      className="rounded-lg h-9 sm:h-10 text-xs sm:text-sm border-muted-foreground/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="login-password" className="text-[10px] sm:text-xs font-semibold ml-1">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      className="rounded-lg h-9 sm:h-10 text-xs sm:text-sm border-muted-foreground/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-10 sm:h-11 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-all shadow-md mt-1 text-xs sm:text-sm font-bold text-white"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-1 sm:space-y-1.5">
                  <div className="space-y-0.5">
                    <Label htmlFor="name" className="text-[10px] sm:text-xs font-semibold ml-1">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                      required
                      className="rounded-lg h-9 sm:h-10 text-xs sm:text-sm border-muted-foreground/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="username" className="text-[10px] sm:text-xs font-semibold ml-1">Username</Label>
                    <Input
                      id="username"
                      placeholder="johndoe"
                      value={signupForm.username}
                      onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                      required
                      className="rounded-lg h-9 sm:h-10 text-xs sm:text-sm border-muted-foreground/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="signup-email" className="text-[10px] sm:text-xs font-semibold ml-1">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      required
                      className="rounded-lg h-9 sm:h-10 text-xs sm:text-sm border-muted-foreground/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label htmlFor="signup-password" className="text-[10px] sm:text-xs font-semibold ml-1">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      required
                      className="rounded-lg h-9 sm:h-10 text-xs sm:text-sm border-muted-foreground/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-10 sm:h-11 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-all shadow-md mt-1 text-xs sm:text-sm font-bold text-white"
                    disabled={loading}
                  >
                    {loading ? "Signing Up..." : "Join B Smart"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Verification code sent to <span className="font-semibold text-indigo-600">{pendingEmail}</span>
                </p>
              </div>

              <form onSubmit={handleOtpVerify} className="space-y-3">
                <div className="space-y-0.5">
                  <Label htmlFor="modal-otp" className="text-[10px] sm:text-xs font-semibold ml-1">Enter 6-Digit Code</Label>
                  <Input
                    id="modal-otp"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    required
                    className="rounded-lg h-10 text-center tracking-[0.5em] text-sm sm:text-base font-bold border-muted-foreground/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 sm:h-11 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-all shadow-md text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-2"
                  disabled={loading || otpCode.length !== 6}
                >
                  {loading ? (
                    <>
                      <RefreshCw className="animate-spin h-4 w-4" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Verify Code
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center">
                {canResend ? (
                  <button
                    onClick={handleModalResend}
                    className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
                  >
                    Resend Code
                  </button>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Resend code in <span className="font-medium text-gray-900">{cooldown}s</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
