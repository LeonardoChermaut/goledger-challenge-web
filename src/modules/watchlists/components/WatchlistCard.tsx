import { CardActions } from "@/components/CardActions";
import { watchlistGradients } from "@/shared/constants/constants";
import { IWatchlistData } from "@/shared/interfaces/interfaces";
import { routes } from "@/shared/routes/routes";
import { getGradient } from "@/shared/utils/utils";
import { BookmarkPlus, Tv } from "lucide-react";
import { FunctionComponent } from "react";
import { Link } from "react-router-dom";

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
      <div className={`relative h-36 bg-gradient-to-br ${gradient}`}>
        <Link
          to={routes.route.watchlistDetail(watchlist.title)}
          aria-label={`Ver detalhes da lista ${watchlist.title}`}
          className="absolute inset-0"
        >
          <div className="absolute top-4 left-4">
            <h3 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {watchlist.title}
            </h3>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BookmarkPlus className="h-12 w-12 text-primary/20" />
          </div>
        </Link>
        {showCount > 0 && (
          <div className="absolute right-10 top-4 pointer-events-none">
            <span className="inline-flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-0.5 text font text-foreground backdrop-blur mr-3">
              <Tv className="h-3 w-3" />
              {showCount} {showCount === 1 ? "título" : "títulos"}
            </span>
          </div>
        )}
        <div
          className="absolute right-3 top-3 rounded-full  p-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <CardActions
            onEdit={() => onEdit(watchlist)}
            onDelete={() => onDelete(watchlist)}
          />
        </div>
      </div>

      <Link
        to={routes.route.watchlistDetail(watchlist.title)}
        className="block p-4"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">
          Nota do Colecionador
        </p>
        <p className="line-clamp-2 text-sm text-foreground/70 leading-relaxed italic">
          "{watchlist.description || "Sem descrição."}"
        </p>

        {watchlist.tvShows && watchlist.tvShows.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {watchlist.tvShows.slice(0, 3).map((s) => {
              const tvShowTitle = getTvShowTitle(s["@key"]);
              return (
                <Link
                  key={s["@key"]}
                  to={routes.route.tvshowDetail(tvShowTitle)}
                  title={tvShowTitle}
                  className="flex items-center gap-1.5 rounded-md bg-primary/5 px-2 py-1 text-[10px] font-black text-primary/70 border border-primary/10 transition-all hover:bg-primary/10 uppercase"
                >
                  <Tv className="h-2.5 w-2.5 shrink-0" />
                  <span className="truncate max-w-[80px]">{tvShowTitle}</span>
                </Link>
              );
            })}
            {watchlist.tvShows.length > 3 && (
              <span className="inline-flex items-center rounded-md bg-secondary/40 px-2 py-1 text-[10px] font-bold text-muted-foreground/60 border border-border/20 uppercase">
                +{watchlist.tvShows.length - 3}
              </span>
            )}
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40">
            <BookmarkPlus className="h-3.5 w-3.5" />
            <span>Lista vazia</span>
          </div>
        )}
      </Link>
    </div>
  );
};
