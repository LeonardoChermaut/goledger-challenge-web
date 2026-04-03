import { IWatchlistData } from "@/shared/interfaces/interfaces";
import { useAssetManager } from "./use-assets";
import { useState } from "react";

interface IUseFavoriteOptions {
  watchlists: IWatchlistData[] | undefined;
}

export const useFavorite = ({ watchlists }: IUseFavoriteOptions) => {
  const { createAsset: createWatchlist, deleteAsset: deleteWatchlist } =
    useAssetManager<IWatchlistData>({ assetType: "watchlist" });
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
          title,
          description,
          tvShows: [{ "@assetType": "tvShows", "@key": tvShowKey }],
        });
      }
    } finally {
      setPendingKey(null);
    }
  };

  return { isFavorite, isPending, toggleFavorite };
};
