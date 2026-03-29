import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Assessment", path: "/assessment" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <img
              src="/logo.png"
              alt="Fortify Fitness"
              className="h-8 w-8 rounded-sm object-contain"
            />
            <span className="font-heading text-xl font-bold text-foreground">Fortify Fitness</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className="transition-all"
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="hidden md:inline-flex"
                >
                  Logout
                </Button>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground transition-transform hover:scale-105">
                  {user?.first_name?.[0]?.toUpperCase() || "U"}
                  {user?.last_name?.[0]?.toUpperCase() || ""}
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="hidden md:inline-flex"
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate("/register")}
                  className="hidden md:inline-flex"
                >
                  Sign Up
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start"
              >
                {item.label}
              </Button>
            ))}
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  navigate("/");
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start text-destructive hover:text-destructive"
              >
                Logout
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
