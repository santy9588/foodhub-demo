import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, UtensilsCrossed } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "foodhub-demo";

  return (
    <footer className="bg-charcoal text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <UtensilsCrossed className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">FoodHub</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Delicious food delivered to your door. Order from top restaurants
              across India.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white/80">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/restaurants"
                  className="hover:text-primary transition-colors"
                >
                  All Restaurants
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="hover:text-primary transition-colors"
                >
                  My Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/register-restaurant"
                  className="hover:text-primary transition-colors"
                >
                  Register Business
                </Link>
              </li>
            </ul>
          </div>

          {/* Cuisines */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white/80">
              Cuisines
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link
                  to="/restaurants"
                  className="hover:text-primary transition-colors"
                >
                  Indian
                </Link>
              </li>
              <li>
                <Link
                  to="/restaurants"
                  className="hover:text-primary transition-colors"
                >
                  Chinese
                </Link>
              </li>
              <li>
                <Link
                  to="/restaurants"
                  className="hover:text-primary transition-colors"
                >
                  Italian
                </Link>
              </li>
              <li>
                <Link
                  to="/restaurants"
                  className="hover:text-primary transition-colors"
                >
                  Mexican
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-white/80">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <span className="text-white/40">Help Center</span>
              </li>
              <li>
                <span className="text-white/40">Contact Us</span>
              </li>
              <li>
                <span className="text-white/40">Privacy Policy</span>
              </li>
              <li>
                <span className="text-white/40">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white/50">
          <p>© {currentYear} FoodHub. All rights reserved.</p>
          <p>
            Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
