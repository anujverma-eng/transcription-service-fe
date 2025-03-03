// Mobile Navigation Props
interface MobileNavMenuProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  isPaidPlan: boolean;
  isAuthPage: boolean;
  handleLogout: () => void;
}

import { logoutUser } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Gem, LayoutDashboard, LogOut, Menu, Rocket, Settings, Shield, User } from "lucide-react";

export default function SiteHeader() {
  const auth = useAppSelector((state) => state.auth);
  console.log(auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname.startsWith("/reset-password") || location.pathname.startsWith("/auth");

  const isLoggedIn = !!auth.user;
  const isAdmin = auth.user?.role === "admin";
  const isPaidPlan = auth.user?.subscriptionPlan === "paid";

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate("/");
    });
  };

  return (
    <header className="sticky top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-1.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20" />
              <path d="M2 5h20" />
              <path d="M3 12h18" />
            </svg>
          </span>
          TranscribePro
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {!isLoggedIn && !isAuthPage && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                onClick={() => navigate("/auth?mode=login")}
              >
                Login
              </Button>
              <Button
                variant="default"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                onClick={() => navigate("/auth?mode=signup")}
              >
                Get Started
                <Rocket className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {isLoggedIn && (
            <>
              <NavLink to="/dashboard" icon={<LayoutDashboard className="h-4 w-4" />}>
                Dashboard
              </NavLink>

              {!isPaidPlan && (
                <Button
                  asChild
                  variant="ghost"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:shadow-lg transition-all"
                >
                  <Link to="/plans">
                    <Gem className="mr-2 h-4 w-4" />
                    Upgrade
                    <span className="ml-2 bg-white/10 px-2 py-1 rounded-full text-xs">PRO</span>
                  </Link>
                </Button>
              )}

              {isAdmin && (
                <NavLink to="/admin" icon={<Shield className="h-4 w-4" />}>
                  Admin
                  <Badge variant="outline" className="ml-2">
                    PRO
                  </Badge>
                </NavLink>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full px-2 space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 group"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center relative">
                      <User className="h-4 w-4 text-white" />
                      <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"></span>
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {auth.user?.name || auth.user?.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">{auth.user?.name}</span>
                      <span className="text-xs text-gray-500">{auth.user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 hover:!bg-red-50 dark:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <MobileNavMenu
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
            isPaidPlan={isPaidPlan}
            isAuthPage={isAuthPage}
            handleLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  );
}

// Reusable NavLink Component
function NavLink({ to, icon, children }: { to: string; icon?: React.ReactNode; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 gap-2",
          isActive && "text-blue-600 dark:text-blue-400 font-semibold"
        )}
      >
        {icon}
        {children}
      </Button>
    </Link>
  );
}

// Enhanced Mobile NavMenu
function MobileNavMenu({ isLoggedIn, isAdmin, isPaidPlan, isAuthPage, handleLogout }: MobileNavMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="p-2">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg w-[280px] sm:w-[320px] border-l dark:border-gray-800"
      >
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TranscribePro
            </SheetTitle>
            {/* <SheetClose>
              <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </SheetClose> */}
          </div>
        </SheetHeader>

        <nav className="flex flex-col gap-1">
          {!isLoggedIn && !isAuthPage && (
            <SheetClose asChild>
              <Button
                variant="default"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                onClick={() => navigate("/auth?mode=signup")}
              >
                Get Started
                <Rocket className="ml-2 h-4 w-1/2" />
              </Button>
            </SheetClose>
          )}

          {isLoggedIn && (
            <>
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-lg py-5",
                    isActive("/dashboard") && "text-blue-600 dark:text-blue-400"
                  )}
                  onClick={() => navigate("/dashboard")}
                >
                  <LayoutDashboard className="mr-3 h-5 w-5" />
                  Dashboard
                </Button>
              </SheetClose>

              {!isPaidPlan && (
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-lg py-5 bg-gradient-to-r from-purple-500/10 to-pink-500/10"
                    onClick={() => navigate("/upgrade")}
                  >
                    <Gem className="mr-3 h-5 w-5" />
                    Upgrade Plan
                    <Badge variant="outline" className="ml-2">
                      PRO
                    </Badge>
                  </Button>
                </SheetClose>
              )}

              {isAdmin && (
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-lg py-5",
                      isActive("/admin") && "text-blue-600 dark:text-blue-400"
                    )}
                    onClick={() => navigate("/admin")}
                  >
                    <Shield className="mr-3 h-5 w-5" />
                    Admin Panel
                  </Button>
                </SheetClose>
              )}

              <div className="mt-4 pt-4 border-t dark:border-gray-800">
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-lg py-5 text-red-600 hover:text-red-700 dark:text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                  </Button>
                </SheetClose>
              </div>
            </>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
