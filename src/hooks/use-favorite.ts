import { IWatchlistData } from "@/shared/interfaces/interfaces";
import { useAssetManager } from "./use-assets";

interface IUseFavoriteOptions {
  watchlists: IWatchlistData[] | undefined;
}

export const useFavorite = ({ watchlists }: IUseFavoriteOptions) => {
  const { createAsset: createWatchlist, deleteAsset: deleteWatchlist } =
    useAssetManager<IWatchlistData>({ assetType: "watchlist" });

  const isFavorite = (title: string): boolean =>
    watchlists?.some((watchlist) => watchlist.title === title) || false;

  const toggleFavorite = async (
    title: string,
    description: string,
    tvShowKey: string,
  ) => {
    const favoritesList = watchlists?.find(
      (watchlist) => watchlist.title === title,
    );

    if (favoritesList) {
      await deleteWatchlist.mutateAsync(favoritesList["@key"]);
    } else {
      await createWatchlist.mutateAsync({
        title,
        description,
        tvShows: [{ "@assetType": "tvShows", "@key": tvShowKey }],
      });
    }
  };

  return { isFavorite, toggleFavorite };
};
