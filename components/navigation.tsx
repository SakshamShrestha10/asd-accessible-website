"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Settings,
  HelpCircle,
  Menu,
  X,
  Heart,
  MessageCircle,
  Calendar,
  Users,
  BookOpen,
  User,
  LogOut,
  Shield,
  Loader2,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/app/auth/logout/actions";

interface AuthUser {
  id: number;
  email: string;
  name: string;
  isAdmin: boolean;
}

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Listen for storage events to sync auth state across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_state_changed") {
        checkAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const navigationItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/coping", label: "Coping Tools", icon: Heart },
    { href: "/communication", label: "Communication", icon: MessageCircle },
    { href: "/appointments", label: "Appointments", icon: Calendar },
    { href: "/community", label: "Community", icon: Users },
    // { href: "/learning", label: "Learning", icon: BookOpen },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutAction();
      setUser(null);
      setIsMenuOpen(false);

      // Trigger storage event to sync across tabs
      localStorage.setItem("auth_state_changed", Date.now().toString());

      // Force page refresh to ensure clean state
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  };

  const handleAdminClick = () => {
    setIsMenuOpen(false);
    router.push("/admin");
  };

  return (
    <nav className="bg-white border-b-2 border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-medium text-slate-800">
              Support Space
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors duration-200"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}

            <div className="ml-4 flex items-center space-x-2">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                  <span className="text-sm text-slate-500">Loading...</span>
                </div>
              ) : user ? (
                <>
                  {user.isAdmin && (
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Link
                        href="/admin"
                        className="flex items-center space-x-1"
                      >
                        <Shield className="h-4 w-4" />
                        <span>Admin</span>
                      </Link>
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=2563eb&textColor=ffffff`}
                            alt={user.name}
                          />
                          <AvatarFallback className="bg-blue-600 text-white text-xs font-medium">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                          {user.isAdmin && (
                            <p className="text-xs leading-none text-blue-600 font-medium">
                              Administrator
                            </p>
                          )}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href="/settings"
                          className="flex items-center cursor-pointer"
                        >
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/settings"
                          className="flex items-center cursor-pointer"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      {user.isAdmin && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link
                              href="/admin"
                              className="flex items-center cursor-pointer text-blue-600"
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              <span>Admin Dashboard</span>
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="flex items-center cursor-pointer"
                        disabled={loggingOut}
                      >
                        {loggingOut ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <LogOut className="mr-2 h-4 w-4" />
                        )}
                        <span>{loggingOut ? "Signing out..." : "Log out"}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm">
                    <Link
                      href="/auth/login"
                      className="flex items-center space-x-1"
                    >
                      <span>Sign In</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href="/auth/register"
                      className="flex items-center space-x-1"
                    >
                      <span>Sign Up</span>
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/help" className="flex items-center space-x-1">
                      <HelpCircle className="h-4 w-4" />
                      <span>Help</span>
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-3 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-slate-200 space-y-2">
                {loading ? (
                  <div className="px-3 py-3 flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                    <span className="text-sm text-slate-500">Loading...</span>
                  </div>
                ) : user ? (
                  <>
                    <div className="px-3 py-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=2563eb&textColor=ffffff`}
                            alt={user.name}
                          />
                          <AvatarFallback className="bg-blue-600 text-white text-xs font-medium">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                          {user.isAdmin && (
                            <p className="text-xs text-blue-600 font-medium">
                              Administrator
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {user.isAdmin && (
                      <button
                        onClick={handleAdminClick}
                        className="flex items-center space-x-3 px-3 py-3 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-200 w-full text-left"
                      >
                        <Shield className="h-5 w-5" />
                        <span className="font-medium">Admin Dashboard</span>
                      </button>
                    )}
                    <Link
                      href="/settings"
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span className="font-medium">Profile</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-5 w-5" />
                      <span className="font-medium">Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors duration-200 w-full text-left disabled:opacity-50"
                    >
                      {loggingOut ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <LogOut className="h-5 w-5" />
                      )}
                      <span className="font-medium">
                        {loggingOut ? "Signing out..." : "Log out"}
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="font-medium">Sign In</span>
                    </Link>
                    <Link
                      href="/auth/register"
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="font-medium">Sign Up</span>
                    </Link>
                    <Link
                      href="/help"
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <HelpCircle className="h-5 w-5" />
                      <span className="font-medium">Help & Support</span>
                    </Link>
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
