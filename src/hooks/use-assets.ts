import { routes } from "@/shared/routes/routes";
import { api } from "@/shared/services/service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ISearchResponse<T> {
  result: T[];
}

const useAssets = <T>(assetType: string, enabled = true) =>
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

const useCreateAsset = <T>(assetType: string) => {
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

const useUpdateAsset = <T>(assetType: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: T & { "@key": string }) =>
      api.put(routes.api.methods.updateAsset, {
        update: { "@assetType": assetType, ...data },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets", assetType] });
      toast.success("Atualizado com sucesso!");
    },
    onError: () => toast.error("Erro ao atualizar."),
  });
};

const useDeleteAsset = (assetType: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (key: string) =>
      api.delete(routes.api.methods.deleteAsset, {
        key: { "@assetType": assetType, "@key": key },
      }),
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

interface IAssetManagerOptions<T> {
  assetType: string;
}

interface IAssetManagerReturn<T> {
  isSubmitting: boolean;
  assets: ReturnType<typeof useAssets<T>>;
  createAsset: ReturnType<typeof useCreateAsset<T>>;
  updateAsset: ReturnType<typeof useUpdateAsset<T>>;
  deleteAsset: ReturnType<typeof useDeleteAsset>;
  submit: (originalItem: T | null, formData: T) => Promise<unknown>;
}

export const useAssetManager = <T extends object>({
  assetType,
}: IAssetManagerOptions<T>): IAssetManagerReturn<T> => {
  const assets = useAssets<T>(assetType);
  const createAsset = useCreateAsset<T>(assetType);
  const updateAsset = useUpdateAsset<T>(assetType);
  const deleteAsset = useDeleteAsset(assetType);

  const submit = async (originalItem: T | null, formData: T) => {
    if (!originalItem) {
      return createAsset.mutateAsync(formData);
    }

    return updateAsset.mutateAsync({
      "@key": (originalItem as T & { "@key": string })["@key"],
      ...formData,
    } as T & { "@key": string });
  };

  return {
    submit,
    assets,
    createAsset,
    updateAsset,
    deleteAsset,
    isSubmitting:
      createAsset.isPending || updateAsset.isPending || deleteAsset.isPending,
  };
};
