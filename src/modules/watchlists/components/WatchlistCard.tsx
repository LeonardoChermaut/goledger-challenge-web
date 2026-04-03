import { CardActions } from "@/components/CardActions";
import { IWatchlistData } from "@/shared/interfaces/interface";
import { Tv } from "lucide-react";
import { FunctionComponent } from "react";

type WatchlistCardProps = {
  watchlist: IWatchlistData;
  onEdit: (wl: IWatchlistData) => void;
  onDelete: (wl: IWatchlistData) => void;
  getTvShowTitle: (key: string) => string;
};

export const WatchlistCard: FunctionComponent<WatchlistCardProps> = ({
  watchlist,
  getTvShowTitle,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="glass-card p-5 flex flex-col h-full gap-3 group relative hover:shadow-xl hover:z-20 hover:border-primary/30 animate-fade-in cursor-default">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-heading text-lg font-semibold text-foreground leading-snug flex-1 truncate">
          {watchlist.title}
        </h3>

        <CardActions
          onEdit={() => onEdit(watchlist)}
          onDelete={() => onDelete(watchlist)}
        />
      </div>

      {watchlist.description && (
        <p className="text-sm text-muted-foreground line-clamp-4 font-medium leading-relaxed bg-secondary/20 p-3 rounded-md border border-border/10 italic">
          "{watchlist.description}"
        </p>
      )}

      {watchlist.tvShows && watchlist.tvShows.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1 mt-auto">
          {watchlist.tvShows.map((s) => (
            <span
              key={s["@key"]}
              title={getTvShowTitle(s["@key"])}
              className="flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary border border-primary/20 max-w-[140px] transition-all hover:bg-primary/20 cursor-default"
            >
              <Tv className="h-3 w-3 shrink-0" />
              <span className="truncate">{getTvShowTitle(s["@key"])}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
