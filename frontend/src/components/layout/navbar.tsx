"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, User, Search, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">Asaan Shaadi</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/venues"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Venues
            </Link>
            <Link
              href="/caterers"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Caterers
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>

            {isAuthenticated ? (
              <>
                {user?.role === 'ADMIN' && (
                  <Button variant="ghost" asChild>
                    <Link href="/admin">Admin</Link>
                  </Button>
                )}
                {user?.role === 'VENDOR' && (
                  <Button variant="ghost" asChild>
                    <Link href="/vendor">Dashboard</Link>
                  </Button>
                )}
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/profile">
                    <User className="h-4 w-4" />
                  </Link>
                </Button>
                <span className="text-sm text-muted-foreground">
                  Welcome, {user?.firstName}
                </span>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link
                href="/venues"
                className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary"
                onClick={toggleMenu}
              >
                Venues
              </Link>
              <Link
                href="/caterers"
                className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary"
                onClick={toggleMenu}
              >
                Caterers
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary"
                onClick={toggleMenu}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-2 px-3 py-2">
                {isAuthenticated ? (
                  <>
                    {user?.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary"
                        onClick={toggleMenu}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    {user?.role === 'VENDOR' && (
                      <Link
                        href="/vendor"
                        className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary"
                        onClick={toggleMenu}
                      >
                        Vendor Dashboard
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary"
                      onClick={toggleMenu}
                    >
                      Profile
                    </Link>
                    <Button variant="outline" onClick={handleLogout} className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild className="w-full">
                      <Link href="/auth/login">Login</Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/auth/register">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
