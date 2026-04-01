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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { FoodType } from "../backend";
import MenuItemUpload from "../components/menu/MenuItemUpload";
import { useAuth } from "../contexts/AuthContext";
import { useAddMenuItem, useMenu } from "../hooks/useMenu";

export default function ManageMenuPage() {
  const navigate = useNavigate();
  const { restaurantId } = useParams({ from: "/manage-menu/$restaurantId" });
  const { isAuthenticated, login } = useAuth();
  const addMenuItemMutation = useAddMenuItem();
  const { data: menuItems } = useMenu(restaurantId);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    foodType: "" as FoodType | "",
    prepTime: "",
    available: true,
    imageUrl: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Item name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price || Number(formData.price) <= 0)
      newErrors.price = "Price must be greater than 0";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.foodType) newErrors.foodType = "Food type is required";
    if (!formData.prepTime || Number(formData.prepTime) <= 0)
      newErrors.prepTime = "Prep time must be greater than 0";
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
      const priceInCents = Math.round(Number(formData.price) * 100);
      await addMenuItemMutation.mutateAsync({
        restaurantId,
        itemInput: {
          name: formData.name,
          description: formData.description,
          price: BigInt(priceInCents),
          category: formData.category,
          foodType: formData.foodType as FoodType,
          prepTime: BigInt(formData.prepTime),
          available: formData.available,
          imageUrl: formData.imageUrl || "",
        },
      });
      toast.success("Menu item added successfully!");
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        foodType: "" as FoodType | "",
        prepTime: "",
        available: true,
        imageUrl: "",
      });
      setErrors({});
    } catch (error: any) {
      toast.error(error.message || "Failed to add menu item");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container max-w-2xl py-12">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to manage menu items
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
      <div className="bg-charcoal text-white py-8">
        <div className="container">
          <h1 className="text-2xl font-bold">Manage Menu</h1>
          <p className="text-white/70 mt-1">
            Add and manage items for your restaurant
          </p>
        </div>
      </div>

      <div className="container max-w-3xl py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() =>
              navigate({
                to: "/restaurant/$restaurantId",
                params: { restaurantId },
              })
            }
            className="-ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/my-restaurants" })}
          >
            My Restaurants
          </Button>
        </div>

        {/* Existing items count */}
        {menuItems && menuItems.length > 0 && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-primary font-medium">
              ✓ {menuItems.length} item{menuItems.length !== 1 ? "s" : ""}{" "}
              currently in menu
            </p>
          </div>
        )}

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Menu Item
            </CardTitle>
            <CardDescription>
              Add a new item to your restaurant menu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              data-ocid="add-menu-item.panel"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Butter Chicken"
                  data-ocid="item-name.input"
                />
                {errors.name && (
                  <p
                    className="text-sm text-destructive"
                    data-ocid="item-name.error_state"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your dish..."
                  rows={3}
                  data-ocid="item-description.textarea"
                />
                {errors.description && (
                  <p
                    className="text-sm text-destructive"
                    data-ocid="item-description.error_state"
                  >
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="250.00"
                    data-ocid="item-price.input"
                  />
                  {errors.price && (
                    <p
                      className="text-sm text-destructive"
                      data-ocid="item-price.error_state"
                    >
                      {errors.price}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prepTime">Prep Time (mins) *</Label>
                  <Input
                    id="prepTime"
                    type="number"
                    min="1"
                    value={formData.prepTime}
                    onChange={(e) =>
                      setFormData({ ...formData, prepTime: e.target.value })
                    }
                    placeholder="20"
                    data-ocid="prep-time.input"
                  />
                  {errors.prepTime && (
                    <p
                      className="text-sm text-destructive"
                      data-ocid="prep-time.error_state"
                    >
                      {errors.prepTime}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="e.g., Main Course"
                    data-ocid="item-category.input"
                  />
                  {errors.category && (
                    <p
                      className="text-sm text-destructive"
                      data-ocid="item-category.error_state"
                    >
                      {errors.category}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foodType">Food Type *</Label>
                  <Select
                    value={formData.foodType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, foodType: value as FoodType })
                    }
                  >
                    <SelectTrigger id="foodType" data-ocid="food-type.select">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="veg">🟢 Vegetarian</SelectItem>
                      <SelectItem value="nonVeg">🔴 Non-Vegetarian</SelectItem>
                      <SelectItem value="beverage">🔵 Beverage</SelectItem>
                      <SelectItem value="dessert">🟣 Dessert</SelectItem>
                      <SelectItem value="snack">🟡 Snack</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.foodType && (
                    <p
                      className="text-sm text-destructive"
                      data-ocid="food-type.error_state"
                    >
                      {errors.foodType}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <MenuItemUpload
                imageUrl={formData.imageUrl}
                onImageUrlChange={(url) =>
                  setFormData({ ...formData, imageUrl: url })
                }
              />

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="available">Available</Label>
                  <p className="text-sm text-muted-foreground">
                    Currently available for orders?
                  </p>
                </div>
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, available: checked })
                  }
                  data-ocid="item-available.switch"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-white hover:bg-primary/90"
                disabled={addMenuItemMutation.isPending}
                data-ocid="add-menu-item.submit_button"
              >
                {addMenuItemMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Item...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Menu Item
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
