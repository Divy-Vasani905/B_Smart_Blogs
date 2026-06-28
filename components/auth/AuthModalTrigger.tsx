"use client";

import { useEffect, useState } from "react";
import { AuthModal } from "./AuthModal";
import { api } from "@/lib/api";

export function AuthModalTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const { status } = await api.get("/api/auth/me");
        if (status === 401) {
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
    const timer = setTimeout(async () => {
      try {
        const { status } = await api.get("/api/auth/me");
        const isNotLoggedIn = status === 401;

        if (isNotLoggedIn) {
          setIsOpen((prevIsOpen) => {
            if (!prevIsOpen) {
              return true;
            }
            return prevIsOpen;
          });
        }
      } catch (err) {
        // Assume not logged in on error
        setIsOpen((prevIsOpen) => {
          if (!prevIsOpen) {
            return true;
          }
          return prevIsOpen;
        });
      }
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
