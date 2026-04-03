import { CardActions } from "@/components/CardActions";
import { cn } from "@/lib/lib";
import { seasonGradients } from "@/shared/constants/constants";
import { ISeasonData } from "@/shared/interfaces/interface";
import {
  getAgeRecommendationColor,
  getGradient,
  isValidAge,
} from "@/shared/utils/utils";
import { Film, Heart } from "lucide-react";
import { FunctionComponent } from "react";

type SeasonCardProps = {
  season: ISeasonData;
  tvShowTitle: string;
  tvShowAge: number | undefined;
  isFavorite: boolean;
  onEdit: (season: ISeasonData) => void;
  onDelete: (season: ISeasonData) => void;
  onToggleFavorite: (season: ISeasonData) => void;
};

export const SeasonCard: FunctionComponent<SeasonCardProps> = ({
  season,
  tvShowTitle,
  tvShowAge,
  isFavorite,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const displayAge =
    tvShowAge != null && isValidAge(tvShowAge) ? tvShowAge : null;
  const gradient = getGradient(seasonGradients, tvShowTitle);

  return (
    <div className="group glass-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 animate-fade-in">
      <div
        className={`relative h-36 bg-gradient-to-br ${gradient} cursor-pointer`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Film className="h-12 w-12 text-primary/20" />
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-2">
          {displayAge != null && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium backdrop-blur-sm",
                getAgeRecommendationColor(displayAge),
              )}
            >
              {displayAge}+
            </span>
          )}
          <button
            onClick={() => onToggleFavorite(season)}
            className={cn(
              "rounded-full p-1  transition-colors",
              isFavorite
                ? "text-red-500"
                : "text-muted-foreground hover:text-red-500",
            )}
            title={
              isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
          >
            <Heart
              className={cn(
                `h-3.5 w-3.5 ${isFavorite && "fill-current"} ${!isFavorite && "hover:fill-red-500"}`,
              )}
            />
          </button>
          <CardActions
            onEdit={() => onEdit(season)}
            onDelete={() => onDelete(season)}
          />
        </div>
      </div>

      <div className="p-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {tvShowTitle}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Temporada {season.number}</span>
            <span>·</span>
            <span>{season.year}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
