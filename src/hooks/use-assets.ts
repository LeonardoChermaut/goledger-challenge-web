import { routes } from "@/shared/routes/routes";
import { api } from "@/shared/services/service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ISearchResponse<T> {
  result: T[];
}

export const useAssets = <T>(assetType: string, enabled = true) =>
  useQuery({
    queryKey: ["assets", assetType],
    queryFn: async () => {
      const { result } = await api.post<ISearchResponse<T>, any>(
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
    mutationFn: (asset: Record<string, any>) =>
      api.post<T, any>(routes.api.methods.createAsset, {
        asset: [{ "@assetType": assetType, ...asset }],
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
    mutationFn: (update: Record<string, any>) =>
      api.put<T, any>(routes.api.methods.updateAsset, {
        update: { "@assetType": assetType, ...update },
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
    mutationFn: (key: Record<string, any>) =>
      api.delete(routes.api.methods.deleteAsset, { key }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets", assetType] });
      toast.success("Removido com sucesso!");
    },
    onError: () =>
      toast.error(
        "Não foi possível remover. Verifique se não há nenhum item vinculado a este.",
      ),
  });
};

export const useEditAsset = (assetType: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      oldKey: string;
      newData: Record<string, any>;
    }) => {
      await api.delete(routes.api.methods.deleteAsset, {
        key: { "@assetType": assetType, "@key": data.oldKey },
      });
      await api.post(routes.api.methods.createAsset, {
        asset: [{ "@assetType": assetType, ...data.newData }],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets", assetType] });
      toast.success("Atualizado com sucesso!");
    },
    onError: () => toast.error("Erro ao atualizar."),
  });
};
