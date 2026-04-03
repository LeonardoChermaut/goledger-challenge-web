import { CardActions } from "@/components/CardActions";
import { cn } from "@/lib/lib";
import { episodeGradients } from "@/shared/constants/constants";
import { IEpisodeData } from "@/shared/interfaces/interface";
import {
  getAgeRecommendationColor,
  getEpisodeDisplayDate,
  getGradient,
  isValidAge,
  isValidEpisodeRating,
} from "@/shared/utils/utils";
import { Calendar, Heart, PlayCircle, Star, Tag } from "lucide-react";
import { FunctionComponent } from "react";

type EpisodeCardProps = {
  episode: IEpisodeData;
  seasonLabel: string;
  tvShowAge: number | undefined;
  isFavorite: boolean;
  onEdit: (ep: IEpisodeData) => void;
  onDelete: (ep: IEpisodeData) => void;
  onToggleFavorite: (ep: IEpisodeData) => void;
};

export const EpisodeCard: FunctionComponent<EpisodeCardProps> = ({
  episode,
  seasonLabel,
  tvShowAge,
  isFavorite,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
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
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayCircle className="h-12 w-12 text-primary/20" />
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-2">
          {displayEpisodeRating != null && (
            <div className="flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm">
              <Star className="h-3 w-3 fill-current text-primary" />
              {displayEpisodeRating}
            </div>
          )}
          <button
            onClick={() => onToggleFavorite(episode)}
            className={cn(
              "rounded-full p-1 backdrop-blur-sm transition-colors",
              isFavorite
                ? "text-red-500 bg-background/60"
                : "text-muted-foreground bg-background/60 hover:text-foreground",
            )}
            title={
              isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
          >
            <Heart
              className={cn("h-3.5 w-3.5", isFavorite && "fill-current")}
            />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {episode.title}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="line-clamp-1">{seasonLabel}</span>
              <span>·</span>
              <span>E{episode.episodeNumber}</span>
            </div>
          </div>
          <CardActions
            onEdit={() => onEdit(episode)}
            onDelete={() => onDelete(episode)}
          />
        </div>

        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground/80 leading-relaxed">
          {episode.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground/70">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{getEpisodeDisplayDate(episode, tvShowAge)}</span>
          </div>
          {displayTvShowAge != null && (
            <div className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-xs font-medium",
                  getAgeRecommendationColor(displayTvShowAge),
                )}
              >
                {displayTvShowAge}+
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
