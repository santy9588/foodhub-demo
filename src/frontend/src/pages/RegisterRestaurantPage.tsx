import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Store } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { CuisineType } from "../backend";
import { useAuth } from "../contexts/AuthContext";
import { useRegisterRestaurant } from "../hooks/useRestaurants";

export default function RegisterRestaurantPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const registerMutation = useRegisterRestaurant();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    logoUrl: "",
    cuisineType: "" as CuisineType | "",
    openingTime: "10:00 AM",
    closingTime: "10:00 PM",
    avgPrepTime: "30",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Restaurant name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.cuisineType)
      newErrors.cuisineType = "Cuisine type is required";
    if (!formData.avgPrepTime || Number(formData.avgPrepTime) <= 0)
      newErrors.avgPrepTime = "Average prep time must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }
    try {
      const restaurant = await registerMutation.mutateAsync({
        name: formData.name,
        address: formData.address,
        logoUrl: formData.logoUrl || "",
        cuisineType: formData.cuisineType as CuisineType,
        openingHours: {
          openingTime: formData.openingTime,
          closingTime: formData.closingTime,
        },
        avgPrepTime: BigInt(formData.avgPrepTime),
      });
      toast.success("Restaurant registered successfully!");
      navigate({
        to: "/manage-menu/$restaurantId",
        params: { restaurantId: restaurant.id },
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to register restaurant");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container max-w-2xl py-12">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to register a restaurant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={login} className="w-full" data-ocid="login.button">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-charcoal text-white py-12">
        <div className="container">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
              <Store className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Register Your Restaurant</h1>
              <p className="text-white/70 mt-1">
                Join FoodHub and reach more customers across India
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-2xl py-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: "/" })}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Restaurant Details</CardTitle>
            <CardDescription>
              Fill in the information about your restaurant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              data-ocid="register-restaurant.panel"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Restaurant Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Spice Garden"
                  data-ocid="restaurant-name.input"
                />
                {errors.name && (
                  <p
                    className="text-sm text-destructive"
                    data-ocid="restaurant-name.error_state"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Full Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="e.g., 123 MG Road, Bangalore 560001"
                  data-ocid="restaurant-address.input"
                />
                {errors.address && (
                  <p
                    className="text-sm text-destructive"
                    data-ocid="restaurant-address.error_state"
                  >
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL (optional)</Label>
                <Input
                  id="logoUrl"
                  value={formData.logoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, logoUrl: e.target.value })
                  }
                  placeholder="https://example.com/logo.jpg"
                  data-ocid="restaurant-logo.input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuisineType">Cuisine Type *</Label>
                <Select
                  value={formData.cuisineType}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      cuisineType: value as CuisineType,
                    })
                  }
                >
                  <SelectTrigger
                    id="cuisineType"
                    data-ocid="cuisine-type.select"
                  >
                    <SelectValue placeholder="Select cuisine type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indian">Indian</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="italian">Italian</SelectItem>
                    <SelectItem value="mexican">Mexican</SelectItem>
                    <SelectItem value="american">American</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="mediterranean">Mediterranean</SelectItem>
                  </SelectContent>
                </Select>
                {errors.cuisineType && (
                  <p
                    className="text-sm text-destructive"
                    data-ocid="cuisine-type.error_state"
                  >
                    {errors.cuisineType}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openingTime">Opening Time</Label>
                  <Input
                    id="openingTime"
                    value={formData.openingTime}
                    onChange={(e) =>
                      setFormData({ ...formData, openingTime: e.target.value })
                    }
                    placeholder="10:00 AM"
                    data-ocid="opening-time.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closingTime">Closing Time</Label>
                  <Input
                    id="closingTime"
                    value={formData.closingTime}
                    onChange={(e) =>
                      setFormData({ ...formData, closingTime: e.target.value })
                    }
                    placeholder="10:00 PM"
                    data-ocid="closing-time.input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avgPrepTime">
                  Average Preparation Time (minutes) *
                </Label>
                <Input
                  id="avgPrepTime"
                  type="number"
                  min="1"
                  value={formData.avgPrepTime}
                  onChange={(e) =>
                    setFormData({ ...formData, avgPrepTime: e.target.value })
                  }
                  placeholder="30"
                  data-ocid="prep-time.input"
                />
                {errors.avgPrepTime && (
                  <p
                    className="text-sm text-destructive"
                    data-ocid="prep-time.error_state"
                  >
                    {errors.avgPrepTime}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-white hover:bg-primary/90"
                disabled={registerMutation.isPending}
                data-ocid="register-restaurant.submit_button"
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register Restaurant"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
