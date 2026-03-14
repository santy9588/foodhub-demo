import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingBag, History, User, LogOut, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { isAuthenticated, login, logout, isLoggingIn, principal } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-bold">FoodHub</span>
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/orders' })}
                className="hidden sm:flex"
              >
                <History className="mr-2 h-4 w-4" />
                Orders
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="font-mono text-xs truncate">{principal?.slice(0, 20)}...</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate({ to: '/orders' })} className="sm:hidden">
                    <History className="mr-2 h-4 w-4" />
                    Order History
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ to: '/register-restaurant' })}>
                    <Store className="mr-2 h-4 w-4" />
                    Register Restaurant
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={login} disabled={isLoggingIn} size="sm">
              {isLoggingIn ? 'Signing in...' : 'Sign In'}
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
