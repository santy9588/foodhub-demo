import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  History,
  LogOut,
  ShoppingCart,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import CartDrawer from "../cart/CartDrawer";

export default function Header() {
  const { isAuthenticated, login, logout, isLoggingIn, principal } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <header
      className="sticky top-0 z-50 w-full flex h-16"
      data-ocid="header.panel"
    >
      {/* Dark left segment - Brand */}
      <div className="bg-charcoal flex items-center px-6 shrink-0">
        <Link to="/" className="flex items-center gap-2" data-ocid="nav.link">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <UtensilsCrossed className="h-5 w-5 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            FoodHub
          </span>
        </Link>
      </div>

      {/* Light right segment - Nav */}
      <div className="bg-white border-b border-border flex-1 flex items-center justify-between px-6 shadow-xs">
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
            data-ocid="nav.link"
          >
            Home
          </Link>
          <Link
            to="/restaurants"
            className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
            data-ocid="nav.link"
          >
            Restaurants
          </Link>
          <Link
            to="/register-restaurant"
            className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
            data-ocid="nav.link"
          >
            Register Business
          </Link>
          <Link
            to="/orders"
            className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
            data-ocid="nav.link"
          >
            Orders
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Cart */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="relative"
                data-ocid="cart.button"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Cart</span>
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-white border-2 border-white">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-lg p-0">
              <CartDrawer />
            </SheetContent>
          </Sheet>

          {/* Auth */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" data-ocid="account.button">
                  <span className="hidden sm:inline text-xs font-mono">
                    {principal?.slice(0, 8)}...
                  </span>
                  <span className="sm:hidden">Account</span>
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={() => navigate({ to: "/orders" })}
                  data-ocid="account.dropdown_menu"
                >
                  <History className="mr-2 h-4 w-4" />
                  Order History
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate({ to: "/my-restaurants" })}
                >
                  <Store className="mr-2 h-4 w-4" />
                  My Restaurants
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate({ to: "/register-restaurant" })}
                >
                  <Store className="mr-2 h-4 w-4" />
                  Register Restaurant
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} data-ocid="logout.button">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={login}
              disabled={isLoggingIn}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-white"
              data-ocid="login.button"
            >
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
