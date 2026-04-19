import {
  IEpisodeData,
  ISeasonData,
  ITvShowData,
  IWatchlistData,
} from "@/shared/interfaces/interfaces";
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

export type AssetTypeMapProps = {
  tvShows: ITvShowData;
  seasons: ISeasonData;
  episodes: IEpisodeData;
  watchlist: IWatchlistData;
};

interface ISearchResponse<T> {
  result: T[];
}

export const useAssets = <K extends keyof AssetTypeMapProps>(
  assetType: K,
  enabled = true,
) =>
  useQuery({
    queryKey: ["assets", assetType],
    queryFn: async () => {
      const { result } = await api.post<
        ISearchResponse<AssetTypeMapProps[K]>,
        unknown
      >(routes.api.methods.search, {
        query: {
          selector: {
            "@assetType": assetType,
          },
        },
      });
      return result;
    },
    enabled,
  });

export const useCreateAsset = <K extends keyof AssetTypeMapProps>(
  assetType: K,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (asset: Omit<AssetTypeMapProps[K], "@key">) =>
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

export const useUpdateAsset = <K extends keyof AssetTypeMapProps>(
  assetType: K,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssetTypeMapProps[K]) =>
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

export const useDeleteAsset = <K extends keyof AssetTypeMapProps>(
  assetType: K,
) => {
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
      let serverMessage = "Erro ao remover.";

      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        serverMessage = error.message;
      }

      const userMessage =
        serverMessage.length < 300
          ? serverMessage
          : "Não foi possível remover. Verifique se não há itens vinculados a este registro.";

      toast.error(userMessage, { duration: 5000 });
    },
  });
};

export const useAssetBySlug = <K extends keyof AssetTypeMapProps>({
  assetType,
  slug,
  enabled = true,
}: {
  assetType: K;
  slug: string | undefined;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["asset", assetType, slug],
    queryFn: async (): Promise<AssetTypeMapProps[K] | null> => {
      if (!slug) {
        return null;
      }

      const { result: assets } = await api.post<
        ISearchResponse<AssetTypeMapProps[K]>,
        unknown
      >(routes.api.methods.search, {
        query: {
          selector: {
            "@assetType": assetType,
          },
        },
      });

      const { result: tvShows } = await api.post<
        ISearchResponse<ITvShowData>,
        unknown
      >(routes.api.methods.search, {
        query: {
          selector: {
            "@assetType": "tvShows",
          },
        },
      });

      const { result: seasons } = await api.post<
        ISearchResponse<ISeasonData>,
        unknown
      >(routes.api.methods.search, {
        query: {
          selector: {
            "@assetType": "seasons",
          },
        },
      });

      const findAsset = <T extends { "@key": string }>(
        list: T[],
        key: string,
      ) => list.find((asset) => asset["@key"] === key);

      const item = assets.find((asset) => {
        if (assetType === "tvShows" || assetType === "watchlist") {
          const itemWithTitle = asset as unknown as { title?: string };
          return slugify(itemWithTitle.title || "") === slug;
        }

        if (assetType === "seasons") {
          const season = asset as unknown as ISeasonData;
          const parent = findAsset(tvShows, season.tvShow["@key"]);
          const seasonSlug = slugify(
            `${parent?.title || ""} temporada ${season.number}`,
          );

          return seasonSlug === slug;
        }

        if (assetType === "episodes") {
          const episode = asset as unknown as IEpisodeData;
          const season = findAsset(seasons, episode.season["@key"]);
          const parent = findAsset(tvShows, season?.tvShow["@key"] || "");
          const episodeSlug = slugify(
            `${parent?.title || ""}-temporada-${season?.number || ""}-episodio-${episode.episodeNumber}-${episode.title}`,
          );

          return episodeSlug === slug;
        }

        return false;
      });

      if (!item) {
        return assets.find((asset) => asset["@key"] === slug) || null;
      }

      return item;
    },
    enabled: enabled && !!slug,
  });
};

interface IAssetManagerReturn<K extends keyof AssetTypeMapProps> {
  isSubmitting: boolean;
  assets: UseQueryResult<AssetTypeMapProps[K][]>;
  deleteAsset: ReturnType<typeof useDeleteAsset<K>>;
  createAsset: ReturnType<typeof useCreateAsset<K>>;
  updateAsset: ReturnType<typeof useUpdateAsset<K>>;
  submit: (
    originalItem: AssetTypeMapProps[K] | null,
    formData: Omit<AssetTypeMapProps[K], "@key">,
  ) => Promise<unknown>;
}

export function useAssetManager<K extends keyof AssetTypeMapProps>(
  assetType: K,
): IAssetManagerReturn<K> {
  const assets = useAssets(assetType);
  const deleteAsset = useDeleteAsset(assetType);
  const createAsset = useCreateAsset(assetType);
  const updateAsset = useUpdateAsset(assetType);

  const submit = async (
    originalItem: AssetTypeMapProps[K] | null,
    formData: Omit<AssetTypeMapProps[K], "@key">,
  ) => {
    if (!originalItem) {
      return createAsset.mutateAsync(formData);
    }

    const payload = {
      ...formData,
      "@key": originalItem["@key"],
      "@assetType": assetType,
    } as AssetTypeMapProps[K];

    return updateAsset.mutateAsync(payload);
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
}
