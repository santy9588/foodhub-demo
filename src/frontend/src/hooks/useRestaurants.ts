import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Restaurant, RestaurantInput } from "../backend";
import { useActor } from "./useActor";

export function useRestaurants() {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<Restaurant[]>({
    queryKey: ["restaurants"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRestaurants();
    },
    enabled: !!actor && !isActorFetching,
  });
}

export function useInitSampleData() {
  const { actor } = useActor();

  return useQuery({
    queryKey: ["init-sample-data"],
    queryFn: async () => {
      if (!actor) return null;
      await actor.initSampleData();
      return true;
    },
    enabled: !!actor,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useRegisterRestaurant() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RestaurantInput) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.registerRestaurant(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });
}
