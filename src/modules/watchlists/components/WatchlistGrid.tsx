import { IWatchlistData } from "@/shared/interfaces/interfaces";
import { WatchlistCard } from "./WatchlistCard";

type WatchlistGridProps = {
  watchlists: IWatchlistData[];
  getTvShowTitle: (key: string) => string;
  onEdit: (watchlist: IWatchlistData) => void;
  onDelete: (watchlist: IWatchlistData) => void;
};

export const WatchlistGrid = ({
  watchlists,
  getTvShowTitle,
  onEdit,
  onDelete,
}: WatchlistGridProps) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {watchlists.map((watchlist) => (
        <WatchlistCard
          key={watchlist["@key"]}
          watchlist={watchlist}
          getTvShowTitle={getTvShowTitle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
