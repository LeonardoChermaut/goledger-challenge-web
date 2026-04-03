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

const useCreateAsset = <T>(assetType: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (asset: Record<string, unknown>) =>
      api.post<T, unknown>(routes.api.methods.createAsset, {
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

interface IAssetManagerReturn<TDisplay, TPayload> {
  isSubmitting: boolean;
  assets: UseQueryResult<TDisplay[]>;
  createAsset: ReturnType<typeof useCreateAsset<TPayload>>;
  updateAsset: ReturnType<typeof useUpdateAsset<TPayload>>;
  deleteAsset: ReturnType<typeof useDeleteAsset>;
  submit: (
    originalItem: TDisplay | null,
    formData: TPayload,
  ) => Promise<unknown>;
}

export const useAssetManager = <
  TDisplay extends { "@key": string },
  TPayload extends object = TDisplay,
>({
  assetType,
}: {
  assetType: string;
}): IAssetManagerReturn<TDisplay, TPayload> => {
  const assets = useAssets<TDisplay>(assetType);
  const createAsset = useCreateAsset<TPayload>(assetType);
  const updateAsset = useUpdateAsset<TPayload>(assetType);
  const deleteAsset = useDeleteAsset(assetType);

  const submit = async (originalItem: TDisplay | null, formData: TPayload) => {
    if (!originalItem) {
      return createAsset.mutateAsync(
        formData as unknown as Record<string, unknown>,
      );
    }

    return updateAsset.mutateAsync({
      "@key": originalItem["@key"],
      ...formData,
    } as unknown as TPayload & { "@key": string });
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
