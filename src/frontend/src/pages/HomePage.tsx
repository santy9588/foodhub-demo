import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronRight,
  Coffee,
  Flame,
  Pizza,
  Salad,
  Search,
  Soup,
} from "lucide-react";
import { useState } from "react";
import RestaurantCard from "../components/restaurants/RestaurantCard";
import { useRestaurants } from "../hooks/useRestaurants";

const CATEGORIES = [
  { id: "all", label: "All", icon: Flame },
  { id: "indian", label: "Indian", icon: Soup },
  { id: "chinese", label: "Chinese", icon: Salad },
  { id: "italian", label: "Italian", icon: Pizza },
  { id: "cafe", label: "Cafe", icon: Coffee },
] as const;

const HERO_SKELETONS = ["s1", "s2", "s3", "s4", "s5", "s6"];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { data: restaurants, isLoading } = useRestaurants();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/restaurants" });
    }
  };

  const filteredRestaurants =
    restaurants
      ?.filter((r) => {
        if (activeCategory !== "all" && r.cuisineType !== activeCategory)
          return false;
        return true;
      })
      ?.slice(0, 6) ?? [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[520px] overflow-hidden">
        <img
          src="/assets/generated/hero-food-collage.dim_1600x700.jpg"
          alt="Delicious Indian food"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <div className="max-w-xl">
              <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3 animate-fade-in">
                🍽️ Order food online
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 animate-fade-in-up">
                Delicious Food,
                <br />
                <span className="text-primary">Delivered Fast</span>
              </h1>
              <p className="text-white/80 text-lg mb-8 animate-fade-in-up">
                Order from 100+ top restaurants across India
              </p>

              <form
                onSubmit={handleSearch}
                className="flex gap-3 animate-fade-in-up"
              >
                <Button
                  size="lg"
                  type="button"
                  className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 shrink-0"
                  onClick={() => navigate({ to: "/restaurants" })}
                  data-ocid="hero.primary_button"
                >
                  Order Now
                </Button>
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search restaurants..."
                    className="pl-10 h-11 bg-white/95 border-0 text-foreground placeholder:text-muted-foreground"
                    data-ocid="hero.search_input"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Category Strip */}
      <section className="bg-white border-b">
        <div className="container py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-warm"
                      : "bg-white text-muted-foreground border border-border hover:border-primary hover:text-primary"
                  }`}
                  data-ocid="category.tab"
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Featured Restaurants
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Top-rated places near you
            </p>
          </div>
          <Link
            to="/restaurants"
            className="flex items-center gap-1 text-primary text-sm font-medium"
            data-ocid="view-all.link"
          >
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HERO_SKELETONS.map((id) => (
              <div
                key={id}
                className="bg-card rounded-xl overflow-hidden shadow-card"
                data-ocid="restaurant.loading_state"
              >
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16" data-ocid="restaurant.empty_state">
            <p className="text-muted-foreground text-lg">
              No restaurants found for this category.
            </p>
            <Button
              type="button"
              className="mt-4"
              onClick={() => setActiveCategory("all")}
              data-ocid="clear-filter.button"
            >
              Show All
            </Button>
          </div>
        )}

        {restaurants && restaurants.length > 6 && (
          <div className="text-center mt-8">
            <Link to="/restaurants">
              <Button variant="outline" size="lg" data-ocid="view-all.button">
                View All Restaurants <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </section>

      {/* Register CTA */}
      <section className="bg-charcoal text-white py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Own a Restaurant?</h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
            Join FoodHub and start receiving online orders today. Easy setup, no
            monthly fees.
          </p>
          <Link to="/register-restaurant">
            <Button
              size="lg"
              type="button"
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-8"
              data-ocid="register-cta.primary_button"
            >
              Register Your Restaurant
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
