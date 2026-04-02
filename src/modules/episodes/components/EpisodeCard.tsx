import { DropdownMenu } from "@/components/DropdownMenu";
import { cn } from "@/lib/lib";
import { IEpisodeData } from "@/shared/interfaces/interface";
import {
  getAgeRecommendationColor,
  getEpisodeDisplayDate,
  getRatingColor,
  isValidAge,
  isValidEpisodeRating,
} from "@/shared/utils/utils";
import { Calendar, Heart, Pencil, Star, Trash2 } from "lucide-react";
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

  return (
    <div className="glass-card p-5 flex flex-col h-full gap-3 group relative hover:shadow-xl hover:z-20 hover:border-primary/30 animate-fade-in cursor-default">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs text-muted-foreground">
              {seasonLabel} · E{episode.episodeNumber}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <h3 className="font-heading text-lg font-semibold text-foreground leading-tight">
              {episode.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onToggleFavorite(episode)}
            className={cn(
              "rounded-full p-1.5 transition-colors",
              isFavorite
                ? "text-red-500"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
            title={
              isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
          >
            <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
          </button>

          {displayTvShowAge != null && (
            <span
              className={`rounded px-1.5 py-0.5 text-xs font-medium ${getAgeRecommendationColor(displayTvShowAge)}`}
            >
              {displayTvShowAge}+
            </span>
          )}

          {displayEpisodeRating != null && (
            <span
              className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium ${getRatingColor(displayEpisodeRating)}`}
            >
              <Star className="h-3 w-3 fill-current" />
              {displayEpisodeRating}
            </span>
          )}

          <DropdownMenu
            options={[
              {
                label: "Editar",
                icon: <Pencil className="h-3.5 w-3.5" />,
                onClick: () => onEdit(episode),
              },
              {
                label: "Remover",
                icon: <Trash2 className="h-3.5 w-3.5" />,
                onClick: () => onDelete(episode),
                variant: "destructive",
              },
            ]}
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
        {episode.description}
      </p>

      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 mt-auto">
        <Calendar className="h-4 w-4 shrink-0" />
        <span>{getEpisodeDisplayDate(episode, tvShowAge)}</span>
      </div>
    </div>
  );
};
