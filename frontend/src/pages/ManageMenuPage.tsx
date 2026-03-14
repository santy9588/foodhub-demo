import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '../contexts/AuthContext';
import { useAddMenuItem } from '../hooks/useMenu';
import { FoodType } from '../backend';
import { toast } from 'sonner';
import MenuItemUpload from '../components/menu/MenuItemUpload';

export default function ManageMenuPage() {
  const navigate = useNavigate();
  const { restaurantId } = useParams({ from: '/manage-menu/$restaurantId' });
  const { isAuthenticated, login } = useAuth();
  const addMenuItemMutation = useAddMenuItem();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    foodType: '' as FoodType | '',
    prepTime: '',
    available: true,
    imageUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    if (!formData.foodType) {
      newErrors.foodType = 'Food type is required';
    }
    if (!formData.prepTime || Number(formData.prepTime) <= 0) {
      newErrors.prepTime = 'Preparation time must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the form errors');
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
          imageUrl: formData.imageUrl || '',
        },
      });

      toast.success('Menu item added successfully!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        foodType: '' as FoodType | '',
        prepTime: '',
        available: true,
        imageUrl: '',
      });
      setErrors({});
    } catch (error: any) {
      console.error('Add menu item error:', error);
      toast.error(error.message || 'Failed to add menu item');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container max-w-2xl py-12">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to manage menu items</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={login} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container max-w-3xl py-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/menu/$restaurantId', params: { restaurantId } })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/' })}
          >
            View All Restaurants
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Menu Item
            </CardTitle>
            <CardDescription>Add a new item to your restaurant menu</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Margherita Pizza"
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your dish..."
                  rows={3}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
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
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="12.99"
                  />
                  {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prepTime">Prep Time (minutes) *</Label>
                  <Input
                    id="prepTime"
                    type="number"
                    min="1"
                    value={formData.prepTime}
                    onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                    placeholder="25"
                  />
                  {errors.prepTime && <p className="text-sm text-destructive">{errors.prepTime}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., main, starter, dessert"
                  />
                  {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foodType">Food Type *</Label>
                  <Select
                    value={formData.foodType}
                    onValueChange={(value) => setFormData({ ...formData, foodType: value as FoodType })}
                  >
                    <SelectTrigger id="foodType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="veg">Vegetarian</SelectItem>
                      <SelectItem value="nonVeg">Non-Vegetarian</SelectItem>
                      <SelectItem value="beverage">Beverage</SelectItem>
                      <SelectItem value="dessert">Dessert</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.foodType && <p className="text-sm text-destructive">{errors.foodType}</p>}
                </div>
              </div>

              <Separator />

              <MenuItemUpload
                imageUrl={formData.imageUrl}
                onImageUrlChange={(url) => setFormData({ ...formData, imageUrl: url })}
              />

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="available">Available</Label>
                  <p className="text-sm text-muted-foreground">
                    Is this item currently available for orders?
                  </p>
                </div>
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={addMenuItemMutation.isPending}
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
