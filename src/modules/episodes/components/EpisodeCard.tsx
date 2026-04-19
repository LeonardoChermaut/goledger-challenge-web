import { CardActions } from "@/components/CardActions";
import { cn } from "@/lib/lib";
import { episodeGradients } from "@/shared/constants/constants";
import { IEpisodeData } from "@/shared/interfaces/interfaces";
import { routes } from "@/shared/routes/routes";
import {
  getAgeRecommendationColor,
  getEpisodeDisplayDate,
  getGradient,
  isValidAge,
  isValidEpisodeRating,
} from "@/shared/utils/utils";
import { Calendar, Heart, Loader2, PlayCircle, Star } from "lucide-react";
import { Link } from "react-router-dom";

type EpisodeCardProps = {
  episode: IEpisodeData;
  seasonLabel: string;
  seasonNumber: number;
  tvShowTitle: string;
  tvShowAge: number | undefined;
  isFavorite: boolean;
  isFavoritePending: boolean;
  onEdit: (ep: IEpisodeData) => void;
  onDelete: (ep: IEpisodeData) => void;
  onToggleFavorite: () => void;
};


export const EpisodeCard = ({
  episode,
  seasonLabel,
  seasonNumber,
  tvShowTitle,
  tvShowAge,
  isFavorite,
  isFavoritePending,
  onEdit,
  onDelete,
  onToggleFavorite,
}: EpisodeCardProps) => {

  const displayTvShowAge =
    tvShowAge != null && isValidAge(tvShowAge) ? tvShowAge : null;

  const displayEpisodeRating =
    episode.rating != null && isValidEpisodeRating(episode.rating)
      ? episode.rating
      : null;

  const gradient = getGradient(episodeGradients, episode.title);

  return (
    <div className="group glass-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 animate-fade-in">
      <div className={`relative h-36 bg-gradient-to-br ${gradient}`}>
        <Link
          to={routes.route.episodeDetail(
            tvShowTitle,
            seasonNumber,
            episode.episodeNumber,
            episode.title,
          )}
          aria-label={`Ver detalhes do episódio ${episode.episodeNumber}: ${episode.title}`}
          className="absolute inset-0 flex flex-col justify-end"
        >

          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle className="h-12 w-12 text-primary/20 mt-10" />
          </div>
          <div className="p-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {episode.title}
              </h3>
              <div className="mt-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                <span className="line-clamp-1">{seasonLabel}</span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span>E{episode.episodeNumber}</span>
              </div>
            </div>
          </div>
        </Link>
        <div
          className="absolute right-3 top-3 flex items-center gap-2"
          onClick={(event) => event.preventDefault()}
        >
          {displayEpisodeRating != null && displayEpisodeRating > 0 && (
            <div className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black text-foreground backdrop-blur-md border border-white/10">
              <Star className="h-2.5 w-2.5 fill-current text-primary" />
              {displayEpisodeRating.toFixed(1)}
            </div>
          )}
          <button
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite();
            }}
            disabled={isFavoritePending}
            className={cn(
              "rounded-full p-1.5",
              isFavoritePending && "pointer-events-none opacity-50",
              isFavorite
                ? "text-red-500 hover:bg-red-500/5"
                : "text-muted-foreground hover:text-red-500 hover:bg-red-500/5",
            )}
            title={
              isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
          >
            {isFavoritePending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Heart
                className={cn(`h-3 w-3 ${isFavorite && "fill-current"}`)}
              />
            )}
          </button>
          <div
            onClick={(event) => event.stopPropagation()}
            className="rounded-full p-0.5"
          >
            <CardActions
              onEdit={() => onEdit(episode)}
              onDelete={() => onDelete(episode)}
            />
          </div>
        </div>
      </div>

      <Link
        to={routes.route.episodeDetail(
          tvShowTitle,
          seasonNumber,
          episode.episodeNumber,
          episode.title,
        )}
        className="block p-4"
      >
        <p className="line-clamp-2 text-sm text-foreground/70 leading-relaxed italic">
          "{episode.description}"
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{getEpisodeDisplayDate(episode, tvShowAge)}</span>
          </div>
          {displayTvShowAge != null && (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "rounded px-1.5 py-0.5",
                  getAgeRecommendationColor(displayTvShowAge, true),
                )}
              >
                {displayTvShowAge}+
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};
