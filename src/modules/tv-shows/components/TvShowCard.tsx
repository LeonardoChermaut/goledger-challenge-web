import { CardActions } from "@/components/CardActions";
import { cn } from "@/lib/lib";
import { seasonGradients } from "@/shared/constants/constants";
import { ITvShowData } from "@/shared/interfaces/interface";
import { getAgeRecommendationColor, getGradient } from "@/shared/utils/utils";
import { Heart, Shield, Tv } from "lucide-react";
import { FunctionComponent } from "react";

type TvShowCardProps = {
  show: ITvShowData;
  isFavorite: boolean;
  onEdit: (show: ITvShowData) => void;
  onDelete: (show: ITvShowData) => void;
  onToggleFavorite: (show: ITvShowData) => void;
};

export const TvShowCard: FunctionComponent<TvShowCardProps> = ({
  show,
  isFavorite,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const gradient = getGradient(seasonGradients, show.title);

  return (
    <div className="group glass-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 animate-fade-in">
      <div className={`relative h-36 bg-gradient-to-br ${gradient}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <Tv className="h-12 w-12 text-primary/20" />
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium backdrop-blur-sm",
              getAgeRecommendationColor(show.recommendedAge),
            )}
          >
            {show.recommendedAge}+
          </span>
          <button
            onClick={() => onToggleFavorite(show)}
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
          <h3 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {show.title}
          </h3>
          <CardActions
            onEdit={() => onEdit(show)}
            onDelete={() => onDelete(show)}
          />
        </div>

        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3 w-3" />
          <span>Classificacao {show.recommendedAge}+</span>
        </div>

        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground/80 leading-relaxed">
          {show.description}
        </p>
      </div>
    </div>
  );
};
