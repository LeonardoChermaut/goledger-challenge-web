import { routes } from "@/shared/routes/routes";
import { api } from "@/shared/services/service";
import { slugify } from "@/shared/utils/utils";
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
    onError: (error: unknown) => {
      const serverMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message: unknown }).message === "string"
          ? (error as { message: string }).message
          : "Erro ao remover.";

      const userMessage =
        serverMessage && serverMessage.length < 300
          ? serverMessage
          : "Não foi possível remover. Verifique se não há itens vinculados a este registro.";

      toast.error(userMessage, { duration: 6000 });
    },
  });
};

export const useAssetBySlug = <
  T extends {
    "@key": string;
    title?: string;
    number?: number;
    "@assetType": string;
  },
>({
  assetType,
  slug,
  enabled = true,
}: {
  assetType: string;
  slug: string | undefined;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["asset", assetType, slug],
    queryFn: async () => {
      if (!slug) {
        return null;
      }

      const { result: assets } = await api.post<{ result: any[] }, unknown>(
        routes.api.methods.search,
        {
          query: {
            selector: {
              "@assetType": assetType,
            },
          },
        },
      );

      const { result: tvShows } = await api.post<{ result: any[] }, unknown>(
        routes.api.methods.search,
        {
          query: {
            selector: {
              "@assetType": "tvShows",
            },
          },
        },
      );

      const { result: seasons } = await api.post<{ result: any[] }, unknown>(
        routes.api.methods.search,
        {
          query: {
            selector: {
              "@assetType": "seasons",
            },
          },
        },
      );

      const findAsset = (list: any[], key: string) =>
        list.find((a) => a["@key"] === key);

      const item = assets.find((a) => {
        if (assetType === "tvShows" || assetType === "watchlist") {
          return slugify(a.title || "") === slug;
        }

        if (assetType === "seasons") {
          const parent = findAsset(tvShows, a.tvShow["@key"]);
          const seasonSlug = slugify(
            `${parent?.title || ""} temporada ${a.number}`,
          );

          return seasonSlug === slug;
        }

        if (assetType === "episodes") {
          const season = findAsset(seasons, a.season["@key"]);
          const parent = findAsset(tvShows, season?.tvShow["@key"]);
          const episodeSlug = slugify(
            `${parent?.title || ""} s${season?.number || ""} e${a.episodeNumber} ${a.title}`,
          );

          return episodeSlug === slug;
        }

        return false;
      });

      if (!item) {
        return assets.find((a) => a["@key"] === slug) || null;
      }

      return item as T;
    },
    enabled: enabled && !!slug,
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
