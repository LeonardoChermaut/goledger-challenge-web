import { CardActions } from "@/components/CardActions";
import { cn } from "@/lib/lib";
import { ITvShowData } from "@/shared/interfaces/interface";
import { getAgeRecommendationColor } from "@/shared/utils/utils";
import { Heart } from "lucide-react";
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
  return (
    <div className="glass-card p-5 flex flex-col gap-3 group relative hover:shadow-xl hover:z-20 hover:border-primary/30 animate-fade-in cursor-default">
      <div className="flex items-start justify-between">
        <h3 className="font-heading text-lg font-semibold text-foreground leading-tight">
          {show.title}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onToggleFavorite(show)}
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
            <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
          </button>

          <span
            className={`rounded px-2 py-0.5 text-xs font-medium ${getAgeRecommendationColor(show.recommendedAge)}`}
          >
            {show.recommendedAge}+
          </span>

          <CardActions
            onEdit={() => onEdit(show)}
            onDelete={() => onDelete(show)}
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground line-clamp-3 h-15 overflow-hidden">
        {show.description}
      </p>
    </div>
  );
};
