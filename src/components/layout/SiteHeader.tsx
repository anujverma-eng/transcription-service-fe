// src/components/SiteHeader.tsx

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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Gem,
  HelpCircle,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Rocket,
  Settings,
  Shield,
  Tag,
  User,
  Zap,
} from "lucide-react";

export default function SiteHeader() {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // For hiding certain links if we're already on that page:
  const isOnDashboard = location.pathname.startsWith("/dashboard");
  const isOnPlansPage = location.pathname.startsWith("/plans");
  const isOnMyAccount = location.pathname.startsWith("/my-account");
  const isOnAdmin = location.pathname.startsWith("/admin");

  const isAuthPage =
    location.pathname.startsWith("/reset-password") ||
    location.pathname.startsWith("/auth");

  const isLoggedIn = !!auth.user;
  const isAdmin = auth.user?.role === "admin";
  const isPaidPlan = auth.user?.isPaid || false;

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => {
      navigate("/");
    });
  };

  return (
    <header className="sticky top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 shadow-md transition-colors duration-200">
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
          AudioLekh
        </Link>

        {/* Center navigation links - Only show when user is NOT logged in */}
        {!isLoggedIn && (
          <nav className="hidden md:flex items-center space-x-6 absolute left-1/2 transform -translate-x-1/2">
            <a 
              href="/#about" 
              className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              {/* <Tag className="h-4 w-4" /> */}
              <span>About Us</span>
            </a>
            <a 
              href="/#pricing" 
              className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              {/* <Tag className="h-4 w-4" /> */}
              <span>Pricing</span>
            </a>
            <a 
              href="/#faq" 
              className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              {/* <HelpCircle className="h-4 w-4" /> */}
              <span>FAQ</span>
            </a>
            <a 
              href="/#contact" 
              className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              {/* <MessageSquare className="h-4 w-4" /> */}
              <span>Contact Us</span>
            </a>
          </nav>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-3">
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
                Get Started <Rocket className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {isLoggedIn && (
            <>
              {/* Hide Dashboard link if already on Dashboard */}
              {!isOnDashboard && (
                <NavLink
                  to="/dashboard"
                  icon={<LayoutDashboard className="h-4 w-4" />}
                >
                  Dashboard
                </NavLink>
              )}

              {/* Hide Upgrade link if user is already on Plans page or is on paid plan */}
              {!isPaidPlan && !isOnPlansPage && (
                <Link
                  to="/plans"
                  className="
                    inline-flex items-center gap-2 
                    px-4 py-2 text-white
                    bg-gradient-to-r from-blue-600 to-purple-600
                    rounded-md shadow-md
                    transition-transform
                    hover:scale-105
                    active:scale-95
                  "
                >
                  <Zap className="h-4 w-4" />
                  <span>Upgrade</span>
                  <span
                    className="
                      ml-2 text-xs py-0.5 px-1.5
                      rounded-full bg-white/20
                    "
                  >
                    PRO
                  </span>
                </Link>
              )}

              {/* Show Buy More button for paid users */}
              {isPaidPlan && !isOnPlansPage && (
                <Link
                  to="/plans"
                  className="
                    inline-flex items-center gap-2 
                    px-2 py-2 text-white
                    text-sm
                    bg-gradient-to-r from-purple-600 to-blue-500
                    rounded-md shadow-md
                    transition-transform
                    hover:scale-105
                    hover:from-purple-600 hover:to-blue-600
                    active:scale-95
                  "
                >
                  <Gem className="h-4 w-4" />
                  <span>Buy More</span>
                  <span
                    className="
                      ml-2 py-0.5 px-1.5
                      rounded-full bg-white/20
                      text-sm
                    "
                  >
                    MINUTES
                  </span>
                </Link>
              )}

              {/* Admin link, if user is admin (hide if on /admin) */}
              {isAdmin && !isOnAdmin && (
                <NavLink to="/admin" icon={<Shield className="h-4 w-4" />}>
                  Admin Dashboard
                  <Badge variant="outline" className="ml-2">
                    ADMIN
                  </Badge>
                </NavLink>
              )}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-full px-2 space-x-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150 group"
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
                <DropdownMenuContent
                  className="w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in"
                  align="end"
                >
                  <DropdownMenuLabel className="flex items-center gap-2 p-2">
                    <User className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">{auth.user?.name}</span>
                      <span className="text-xs text-gray-500">
                        {auth.user?.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* Hide Dashboard link inside the user menu if on /dashboard */}
                  {!isOnDashboard && (
                    <DropdownMenuItem
                      onClick={() => navigate("/dashboard")}
                      className="cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  {/* Always show My Account, except if on /my-account */}
                  {!isOnMyAccount && (
                    <DropdownMenuItem
                      onClick={() => navigate("/my-account")}
                      className="cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      My Account
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </nav>

        {/* MOBILE NAVIGATION */}
        <div className="md:hidden">
          <MobileNavMenu
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
            isPaidPlan={isPaidPlan}
            isAuthPage={isAuthPage}
            handleLogout={handleLogout}
            isOnPlansPage={isOnPlansPage}
            isOnDashboard={isOnDashboard}
            isOnMyAccount={isOnMyAccount}
            isOnAdmin={isOnAdmin}
          />
        </div>
      </div>
    </header>
  );
}

/** Reusable NavLink for DESKTOP nav */
function NavLink({
  to,
  icon,
  children,
}: {
  to: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 gap-2 transition-colors",
          isActive && "text-blue-600 dark:text-blue-400 font-semibold"
        )}
      >
        {icon}
        {children}
      </Button>
    </Link>
  );
}

/** MOBILE NAV MENU */
interface MobileNavMenuProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  isPaidPlan: boolean;
  isAuthPage: boolean;
  handleLogout: () => void;
  isOnPlansPage: boolean;
  isOnDashboard: boolean;
  isOnMyAccount: boolean;
  isOnAdmin: boolean;
}

function MobileNavMenu({
  isLoggedIn,
  isAdmin,
  isPaidPlan,
  isAuthPage,
  handleLogout,
  isOnPlansPage,
  isOnDashboard,
  isOnMyAccount,
  isOnAdmin,
}: MobileNavMenuProps) {
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
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg w-[280px] sm:w-[320px] border-l dark:border-gray-800 transition-all"
      >
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AudioLekh
            </SheetTitle>
          </div>
        </SheetHeader>

        <nav className="flex flex-col gap-1">
          {/* If user not logged in, show navigation links */}
          {!isLoggedIn && (
            <>
              <SheetClose asChild>
                <a 
                  href="/#about" 
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
                >
                  <Info className="h-5 w-5 text-blue-500" />
                  <span>About Us</span>
                </a>
              </SheetClose>
              
              <SheetClose asChild>
                <a 
                  href="/#pricing" 
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
                >
                  <Tag className="h-5 w-5 text-blue-500" />
                  <span>Pricing</span>
                </a>
              </SheetClose>
              
              <SheetClose asChild>
                <a 
                  href="/#faq" 
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
                >
                  <HelpCircle className="h-5 w-5 text-blue-500" />
                  <span>FAQ</span>
                </a>
              </SheetClose>
              
              <SheetClose asChild>
                <a 
                  href="/#contact" 
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
                >
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  <span>Contact Us</span>
                </a>
              </SheetClose>
              
              <div className="border-t my-2 border-gray-200 dark:border-gray-700"></div>
            </>
          )}

          {/* If user not logged in, show "Get Started" & "Login" */}
          {!isLoggedIn && !isAuthPage && (
            <SheetClose asChild>
              <Button
                variant="default"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 w-full justify-center"
                onClick={() => navigate("/auth?mode=signup")}
              >
                Get Started
                <Rocket className="ml-2 h-4 w-4" />
              </Button>
            </SheetClose>
          )}

          {!isLoggedIn && !isAuthPage && (
            <SheetClose asChild>
              <Button
                variant="outline"
                className="mt-2 w-full justify-center"
                onClick={() => navigate("/auth?mode=login")}
              >
                Login
              </Button>
            </SheetClose>
          )}

          {/* If logged in, show relevant links */}
          {isLoggedIn && (
            <>
              {/* Dashboard link (hide if on /dashboard) */}
              {!isOnDashboard && (
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-lg py-4 transition-colors",
                      isActive("/dashboard") && "text-blue-600 dark:text-blue-400"
                    )}
                    onClick={() => navigate("/dashboard")}
                  >
                    <LayoutDashboard className="mr-3 h-5 w-5" />
                    Dashboard
                  </Button>
                </SheetClose>
              )}

              {/* My Account link (hide if on /my-account) */}
              {!isOnMyAccount && (
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-lg py-4 transition-colors",
                      isActive("/my-account") && "text-blue-600 dark:text-blue-400"
                    )}
                    onClick={() => navigate("/my-account")}
                  >
                    <Settings className="mr-3 h-5 w-5" />
                    My Account
                  </Button>
                </SheetClose>
              )}

              {/* Upgrade Plan (hide if user is paid or on /plans) */}
              {!isPaidPlan && !isOnPlansPage && (
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-lg py-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 transition-colors"
                    onClick={() => navigate("/plans")}
                  >
                    <Gem className="mr-3 h-5 w-5" />
                    Upgrade Plan
                    <Badge variant="outline" className="ml-2">
                      PRO
                    </Badge>
                  </Button>
                </SheetClose>
              )}

              {/* Show Buy More button for paid users */}
              {isPaidPlan && !isOnPlansPage && (
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-lg py-4 bg-gradient-to-r from-purple-600 to-blue-600 transition-colors"
                    onClick={() => navigate("/plans")}
                  >
                    <Gem className="mr-3 h-5 w-5" />
                    Buy More
                  </Button>
                </SheetClose>
              )}

              {/* Admin Panel (hide if on /admin) */}
              {isAdmin && !isOnAdmin && (
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-lg py-4 transition-colors",
                      isActive("/admin") && "text-blue-600 dark:text-blue-400"
                    )}
                    onClick={() => navigate("/admin")}
                  >
                    <Shield className="mr-3 h-5 w-5" />
                    Admin Panel
                  </Button>
                </SheetClose>
              )}

              {/* Logout */}
              <div className="mt-4 pt-4 border-t dark:border-gray-800">
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-lg py-4 text-red-600 hover:text-red-700 dark:text-red-400 transition-colors"
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
