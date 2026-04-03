import { CardActions } from "@/components/CardActions";
import { watchlistGradients } from "@/shared/constants/constants";
import { IWatchlistData } from "@/shared/interfaces/interfaces";
import { getGradient } from "@/shared/utils/utils";
import { BookmarkPlus, Tv } from "lucide-react";
import { FunctionComponent } from "react";

type WatchlistCardProps = {
  watchlist: IWatchlistData;
  getTvShowTitle: (key: string) => string;
  onEdit: (watchlist: IWatchlistData) => void;
  onDelete: (watchlist: IWatchlistData) => void;
};

export const WatchlistCard: FunctionComponent<WatchlistCardProps> = ({
  watchlist,
  getTvShowTitle,
  onEdit,
  onDelete,
}) => {
  const gradient = getGradient(watchlistGradients, watchlist.title);
  const showCount = watchlist.tvShows?.length ?? 0;

  return (
    <div className="group glass-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 animate-fade-in">
      <div
        className={`relative h-36 bg-gradient-to-br ${gradient} cursor-pointer`}
      >
        <div className="absolute top-4 left-4">
          <h3 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {watchlist.title}
          </h3>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <BookmarkPlus className="h-12 w-12 text-primary/20" />
        </div>
        {showCount > 0 && (
          <div className="absolute right-10 top-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm">
              <Tv className="h-3 w-3" />
              {showCount} {showCount === 1 ? "programa" : "programas"}
            </span>
          </div>
        )}
        <div className="absolute right-3 top-3">
          <CardActions
            onEdit={() => onEdit(watchlist)}
            onDelete={() => onDelete(watchlist)}
          />
        </div>
      </div>

      <div className="p-4">
        {watchlist.description && (
          <p className="text-sm font-semibold text-foreground">Descrição</p>
        )}
        {watchlist.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground/80 leading-relaxed">
            "{watchlist.description}"
          </p>
        )}

        {watchlist.tvShows && watchlist.tvShows.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {watchlist.tvShows.slice(0, 5).map((s) => (
              <span
                key={s["@key"]}
                title={getTvShowTitle(s["@key"])}
                className="flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary border border-primary/20 max-w-[140px] transition-all hover:bg-primary/20 cursor-default"
              >
                <Tv className="h-3 w-3 shrink-0" />
                <span className="truncate">{getTvShowTitle(s["@key"])}</span>
              </span>
            ))}
            {watchlist.tvShows.length > 5 && (
              <span className="inline-flex items-center rounded-md bg-secondary/40 px-2 py-0.5 text-[11px] font-medium text-muted-foreground border border-border/20">
                +{watchlist.tvShows.length - 5} mais
              </span>
            )}
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground/60">
            <BookmarkPlus className="h-3.5 w-3.5" />
            <span>Nenhum programa adicionado ainda</span>
          </div>
        )}
      </div>
    </div>
  );
};
