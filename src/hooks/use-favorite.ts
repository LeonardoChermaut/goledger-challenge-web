import { IWatchlistData } from "@/shared/interfaces/interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAssetManager } from "./use-assets";

interface IUseFavoriteOptions {
  watchlists: IWatchlistData[] | undefined;
}

export const useFavorite = ({ watchlists }: IUseFavoriteOptions) => {
  const queryClient = useQueryClient();

  const { createAsset: createWatchlist, deleteAsset: deleteWatchlist } =
    useAssetManager<IWatchlistData>({
      assetType: "watchlist",
    });

  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const isFavorite = (tvShowKey: string): boolean =>
    watchlists?.some((watchlist) =>
      watchlist.tvShows?.some((tvShow) => tvShow["@key"] === tvShowKey),
    ) || false;

  const isPending = (tvShowKey: string): boolean => pendingKey === tvShowKey;

  const toggleFavorite = async (
    title: string,
    description: string,
    tvShowKey: string,
  ) => {
    setPendingKey(tvShowKey);

    try {
      const existingList = watchlists?.find((watchlist) =>
        watchlist.tvShows?.some((tvShow) => tvShow["@key"] === tvShowKey),
      );

      if (existingList) {
        await deleteWatchlist.mutateAsync(existingList["@key"]);
      } else {
        await createWatchlist.mutateAsync({
          "@assetType": "watchlist",
          title,
          description,
          tvShows: [{ "@assetType": "tvShows", "@key": tvShowKey }],
        });
      }

      await queryClient.invalidateQueries({
        queryKey: ["assets", "watchlist"],
      });
    } finally {
      setPendingKey(null);
    }
  };

  return { isFavorite, isPending, toggleFavorite };
};
