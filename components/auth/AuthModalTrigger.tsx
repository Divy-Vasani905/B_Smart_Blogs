"use client";

import { useEffect, useState } from "react";
import { AuthModal } from "./AuthModal";

export function AuthModalTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.status === 401) {
          // Not logged in, start timer
          setShouldShow(true);
        }
      } catch (err) {
        // Assume not logged in or error
        setShouldShow(true);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!shouldShow) return;

    // Show modal after 1 minute (60,000ms)
    const timer = setTimeout(() => {
      // Final check: don't show if they logged in during that minute
      setIsOpen(true);
    }, 60000);

    return () => clearTimeout(timer);
  }, [shouldShow]);

  // If user closes it, we don't want it to keep popping up in the same session
  // unless we want to be persistent. For now, we just show it once.

  return (
    <AuthModal 
      isOpen={isOpen} 
      onClose={() => setIsOpen(false)} 
      defaultTab="login" 
    />
  );
}
