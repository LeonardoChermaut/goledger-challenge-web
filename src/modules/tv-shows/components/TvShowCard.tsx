import { CardActions } from "@/components/CardActions";
import { cn } from "@/lib/lib";
import { seasonGradients } from "@/shared/constants/constants";
import { ITvShowData } from "@/shared/interfaces/interface";
import { getAgeRecommendationColor, getGradient } from "@/shared/utils/utils";
import { Heart, Tv } from "lucide-react";
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
    <div className="group glass-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div
        className={`relative h-36 bg-gradient-to-br ${gradient} cursor-pointer`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Tv className="h-12 w-12 text-primary/20" />
        </div>
        <div className="p-4">
          <h3 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {show.title}
          </h3>
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
            onEdit={() => onEdit(show)}
            onDelete={() => onDelete(show)}
          />
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm font-semibold text-foreground">Descrição</p>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground/80 leading-relaxed">
          {show.description}
        </p>
      </div>
    </div>
  );
};
