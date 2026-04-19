import { CardActions } from "@/components/CardActions";
import { cn } from "@/lib/lib";
import { seasonGradients } from "@/shared/constants/constants";
import { ISeasonData } from "@/shared/interfaces/interfaces";
import { routes } from "@/shared/routes/routes";
import {
  getAgeRecommendationColor,
  getGradient,
  isValidAge,
} from "@/shared/utils/utils";
import { Film, Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

type SeasonCardProps = {
  season: ISeasonData;
  tvShowTitle: string;
  tvShowAge: number | undefined;
  isFavorite: boolean;
  isFavoritePending: boolean;
  onEdit: (season: ISeasonData) => void;
  onDelete: (season: ISeasonData) => void;
  onToggleFavorite: () => void;
};

export const SeasonCard = ({
  season,
  tvShowTitle,
  tvShowAge,
  isFavorite,
  isFavoritePending,
  onEdit,
  onDelete,
  onToggleFavorite,
}: SeasonCardProps) => {
  const displayAge =
    tvShowAge != null && isValidAge(tvShowAge) ? tvShowAge : null;
  const gradient = getGradient(seasonGradients, tvShowTitle);

  return (
    <div className="group glass-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 animate-fade-in">
      <div className={`relative h-36 bg-gradient-to-br ${gradient}`}>
        <Link
          to={routes.route.seasonDetail(tvShowTitle, season.number)}
          aria-label={`Ver detalhes da Temporada ${season.number} de ${tvShowTitle}`}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Film className="h-12 w-12 text-primary/20" />
          </div>
        </Link>
        <div
          className="absolute right-3 top-3 flex items-center gap-2"
          onClick={(event) => event.preventDefault()}
        >
          {displayAge != null && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase backdrop-blur-md ring-1 ring-inset ring-white/10",
                getAgeRecommendationColor(displayAge, true),
              )}
            >
              {displayAge}+
            </span>
          )}
          <button
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite();
            }}
            disabled={isFavoritePending}
            className={cn(
              "rounded-full p-1.5 backdrop-blur-md transition-all hover:bg-red-500/5",
              isFavoritePending && "pointer-events-none opacity-50",
              isFavorite
                ? "text-red-500"
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
              onEdit={() => onEdit(season)}
              onDelete={() => onDelete(season)}
            />
          </div>
        </div>
      </div>

      <Link
        to={routes.route.seasonDetail(tvShowTitle, season.number)}
        className="block p-4"
      >
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {tvShowTitle}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
            <span>Temporada {season.number}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>{season.year}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};
