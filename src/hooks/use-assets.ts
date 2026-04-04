import { routes } from "@/shared/routes/routes";
import { api } from "@/shared/services/service";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { toast } from "sonner";

interface ISearchResponse<T> {
  result: T[];
}

const useAssets = <T>(assetType: string, enabled = true) =>
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

const useCreateAsset = <TDisplay extends { "@key": string }>(
  assetType: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (asset: Omit<TDisplay, "@key">) =>
      api.post(routes.api.methods.createAsset, {
        asset: [{ "@assetType": assetType, ...asset }],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets", assetType] });
      toast.success("Criado com sucesso!");
    },
    onError: () => toast.error("Erro ao criar."),
  });
};

const useUpdateAsset = <TDisplay extends { "@key": string }>(
  assetType: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TDisplay) =>
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

interface IAssetManagerReturn<TDisplay extends { "@key": string }> {
  isSubmitting: boolean;
  deleteAsset: ReturnType<typeof useDeleteAsset>;
  assets: UseQueryResult<TDisplay[]>;
  createAsset: ReturnType<typeof useCreateAsset<TDisplay>>;
  updateAsset: ReturnType<typeof useUpdateAsset<TDisplay>>;
  submit: (
    originalItem: TDisplay | null,
    formData: Omit<TDisplay, "@key">,
  ) => Promise<unknown>;
}

export const useAssetManager = <TDisplay extends { "@key": string }>({
  assetType,
}: {
  assetType: string;
}): IAssetManagerReturn<TDisplay> => {
  const assets = useAssets<TDisplay>(assetType);
  const deleteAsset = useDeleteAsset(assetType);
  const createAsset = useCreateAsset<TDisplay>(assetType);
  const updateAsset = useUpdateAsset<TDisplay>(assetType);

  const submit = async (
    originalItem: TDisplay | null,
    formData: Omit<TDisplay, "@key">,
  ) => {
    if (!originalItem) {
      return createAsset.mutateAsync(formData);
    }

    return updateAsset.mutateAsync({
      ...formData,
      "@key": originalItem["@key"],
    } as TDisplay);
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
