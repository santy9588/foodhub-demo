import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CuisineType } from "../backend";
import RestaurantCard from "../components/restaurants/RestaurantCard";
import { useRestaurants } from "../hooks/useRestaurants";

const CUISINE_FILTERS: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: CuisineType.indian, label: "Indian" },
  { id: CuisineType.chinese, label: "Chinese" },
  { id: CuisineType.italian, label: "Italian" },
  { id: CuisineType.mexican, label: "Mexican" },
  { id: CuisineType.american, label: "American" },
  { id: CuisineType.japanese, label: "Japanese" },
  { id: CuisineType.mediterranean, label: "Mediterranean" },
];

const GRID_SKELETONS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9"];

export default function RestaurantsPage() {
  const [search, setSearch] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState<string>("all");
  const { data: restaurants, isLoading } = useRestaurants();

  const filtered = useMemo(() => {
    if (!restaurants) return [];
    return restaurants.filter((r) => {
      const matchesCuisine =
        cuisineFilter === "all" || r.cuisineType === cuisineFilter;
      const matchesSearch =
        !search.trim() ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.address.toLowerCase().includes(search.toLowerCase()) ||
        r.cuisineType.toLowerCase().includes(search.toLowerCase());
      return matchesCuisine && matchesSearch;
    });
  }, [restaurants, search, cuisineFilter]);

  return (
    <div className="min-h-screen">
      <div className="bg-white border-b">
        <div className="container py-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            All Restaurants
          </h1>
          <p className="text-muted-foreground">
            Find the perfect meal from our top-rated restaurants
          </p>

          <div className="relative max-w-md mt-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, cuisine, location..."
              className="pl-10"
              data-ocid="restaurants.search_input"
            />
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {CUISINE_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setCuisineFilter(f.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  cuisineFilter === f.id
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }`}
                data-ocid="cuisine.tab"
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GRID_SKELETONS.map((id) => (
              <div
                key={id}
                className="bg-card rounded-xl overflow-hidden shadow-card"
                data-ocid="restaurants.loading_state"
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
        ) : filtered.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              {filtered.length} restaurant{filtered.length !== 1 ? "s" : ""}{" "}
              found
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          </>
        ) : (
          <div
            className="text-center py-20"
            data-ocid="restaurants.empty_state"
          >
            <p className="text-xl text-muted-foreground mb-2">
              No restaurants found
            </p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
