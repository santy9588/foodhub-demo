import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { usePlaceOrder } from '../../hooks/useOrders';
import { toast } from 'sonner';

export default function CheckoutButton() {
  const { isAuthenticated, login } = useAuth();
  const { cart, restaurantId, clearCart } = useCart();
  const navigate = useNavigate();
  const placeOrderMutation = usePlaceOrder();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to place an order');
      login();
      return;
    }

    if (!cart || !restaurantId) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    try {
      const orderId = await placeOrderMutation.mutateAsync({
        restaurantId,
        items: cart.items,
      });

      clearCart();
      toast.success('Order placed successfully!');
      navigate({ to: '/order-confirmation/$orderId', params: { orderId } });
    } catch (error) {
      console.error('Failed to place order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isDisabled = !cart || cart.items.length === 0 || isProcessing;

  return (
    <Button onClick={handleCheckout} disabled={isDisabled} className="w-full" size="lg">
      {isProcessing ? 'Processing...' : isAuthenticated ? 'Place Order' : 'Sign In to Order'}
    </Button>
  );
}
