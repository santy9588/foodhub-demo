import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Order, CartItem } from '../backend';

export function useOrderHistory() {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['order-history'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrderHistory();
    },
    enabled: !!actor && !isActorFetching,
    refetchInterval: 10000, // Poll every 10 seconds for status updates
  });
}

export function useOrder(orderId: string) {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<Order | null>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOrder(orderId);
    },
    enabled: !!actor && !isActorFetching && !!orderId,
    refetchInterval: 5000, // Poll every 5 seconds for status updates
  });
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ restaurantId, items }: { restaurantId: string; items: CartItem[] }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.placeOrder(restaurantId, items);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-history'] });
    },
  });
}
