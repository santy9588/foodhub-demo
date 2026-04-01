import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MenuItem, MenuItemInputWithAvailability } from "../backend";
import { useActor } from "./useActor";

export function useMenu(restaurantId: string) {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<MenuItem[]>({
    queryKey: ["menu", restaurantId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRestaurantMenu(restaurantId);
    },
    enabled: !!actor && !isActorFetching && !!restaurantId,
  });
}

export function useAddMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      restaurantId,
      itemInput,
    }: {
      restaurantId: string;
      itemInput: MenuItemInputWithAvailability;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.addMenuItem(restaurantId, itemInput);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["menu", variables.restaurantId],
      });
    },
  });
}
