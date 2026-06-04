"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, TrendingUp, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "./auth/AuthModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getCloudinaryUrl } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blogs", label: "Blogs" },
  { href: "/about", label: "About Us" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");

  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const translateY = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      const headerHeight = headerRef.current?.offsetHeight || 64;

      if (currentScrollY <= 0) {
        translateY.current = 0;
      } else {
        translateY.current = Math.max(-headerHeight, Math.min(0, translateY.current - delta));
      }

      if (headerRef.current) {
        headerRef.current.style.transform = `translateY(${translateY.current}px)`;
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initialize
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/blogs?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const isActive = (href: string) => {
    const p = pathname ?? "";
    return href === "/" ? p === "/" : p === href || p.startsWith(href + "/");
  };

  const openAuth = (tab: "login" | "signup") => {
    setAuthTab(tab);
    setAuthModalOpen(true);
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full border-b border-border bg-background transition-transform duration-300 ease-out"
      style={{ willChange: 'transform' }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center justify-between gap-4 sm:h-14">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 font-bold text-lg tracking-tight"
            aria-label="B Smart Finance – Home"
          >
            <TrendingUp
              className="h-5 w-5 text-emerald-600"
              aria-hidden
            />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              B Smart Finance
            </span>
          </Link>

          {/* Desktop nav + search */}
          <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:gap-6 lg:gap-8">
            <nav className="flex items-center gap-6 lg:gap-8" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${isActive(link.href)
                    ? "text-primary"
                    : "text-muted-foreground"
                    }`}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <form onSubmit={handleSearch} className="relative w-full max-w-[200px] lg:max-w-[240px]" role="search">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <input
                type="search"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-md border border-border bg-secondary/50 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-label="Search blog posts"
              />
            </form>

            <div className="flex items-center gap-3">
              {loading ? (
                <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
              ) : user ? (
                <Link
                  href="/dashboard/profile"
                  className="relative z-[60] block transition-transform hover:scale-105 active:scale-95"
                >
                  <Avatar className="h-9 w-9 border-2 border-emerald-500/20 hover:border-emerald-500 transition-all">
                    <AvatarImage src={getCloudinaryUrl(user.avatar, 96)} className="object-cover" />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                      {user.name[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openAuth("login")} className="text-sm font-medium">
                    Log In
                  </Button>
                  <Button size="sm" onClick={() => openAuth("signup")} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-5">
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-3 md:hidden">
            {user && (
              <Link
                href="/dashboard/profile"
                className="relative z-[60] block"
              >
                <Avatar className="h-8 w-8 border-2 border-emerald-500/20">
                  <AvatarImage src={getCloudinaryUrl(user.avatar, 96)} className="object-cover" />
                  <AvatarFallback className="text-xs bg-emerald-100 text-emerald-700 font-bold">
                    {user.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="inline-flex items-center justify-center rounded-md h-10 w-10 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultTab={authTab}
        />

        {/* Mobile menu */}
        {mobileOpen && (
          <div id="mobile-menu" className="border-t border-border py-4 md:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive(link.href)
                    ? "bg-accent text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  aria-current={isActive(link.href) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <form onSubmit={handleSearch} className="mt-4 px-1" role="search">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <input
                  type="search"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-md border border-border bg-secondary/50 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  aria-label="Search blog posts"
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
