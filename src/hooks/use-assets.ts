import { api } from "@/shared/services/service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { routes } from "../shared/routes/routes";

interface ISearchResponse<T> {
  result: T[];
}

export const useAssets = <T>(assetType: string, enabled = true) =>
  useQuery({
    queryKey: ["assets", assetType],
    queryFn: async () => {
      const { result } = await api.post<ISearchResponse<T>, unknown>(
        routes.api.methods.search,
        {
          query: {
            selector: {
              "@assetType": assetType,
            },
          },
        },
      );

      return result;
    },
    enabled,
  });

export const useCreateAsset = <T>(assetType: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (asset: Record<string, unknown>) =>
      api.post<T, unknown>(routes.api.methods.createAsset, {
        asset: [asset],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets", assetType] });
      toast.success("Criado com sucesso!");
    },
    onError: () => toast.error("Erro ao criar."),
  });
};

export const useUpdateAsset = <T>(assetType: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (update: Record<string, unknown>) =>
      api.put<T, unknown>(routes.api.methods.updateAsset, {
        update,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets", assetType] });
      toast.success("Atualizado com sucesso!");
    },
    onError: () => toast.error("Erro ao atualizar."),
  });
};

export const useDeleteAsset = (assetType: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: Record<string, unknown>) =>
      api.delete(routes.api.methods.deleteAsset, {
        key,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets", assetType] });
      toast.success("Removido com sucesso!");
    },
    onError: () =>
      toast.error(
        "Não foi possivel remover. Verifique se não há nenhum item vinculado a este.",
      ),
  });
};
