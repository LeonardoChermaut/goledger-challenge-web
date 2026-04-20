import { CardActions } from "@/components/CardActions";
import { cn } from "@/lib/lib";
import { seasonGradients } from "@/shared/constants/constants";
import { ITvShowData } from "@/shared/interfaces/interfaces";
import { routes } from "@/shared/routes/routes";
import { getAgeRecommendationColor, getGradient } from "@/shared/utils/utils";
import { Heart, Loader2, Tv } from "lucide-react";
import { Link } from "react-router-dom";

type TvShowCardProps = {
  show: ITvShowData;
  isFavorite: boolean;
  isFavoritePending: boolean;
  onEdit: (show: ITvShowData) => void;
  onDelete: (show: ITvShowData) => void;
  onToggleFavorite: () => void;
};

export const TvShowCard = ({
  show,
  isFavorite,
  isFavoritePending,
  onEdit,
  onDelete,
  onToggleFavorite,
}: TvShowCardProps) => {
  const gradient = getGradient(seasonGradients, show.title);

  return (
    <div className="group glass-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <div className={`relative h-36 bg-gradient-to-br ${gradient}`}>
        <Link
          to={routes.route.tvshowDetail(show.title)}
          aria-label={`Ver detalhes de ${show.title}`}
          className="absolute inset-0 flex flex-col justify-end"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Tv className="h-12 w-12 text-primary/20" />
          </div>
          <div className="p-4">
            <h3 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {show.title}
            </h3>
          </div>
        </Link>
        <div
          className="absolute right-3 top-3 flex items-center gap-2"
          onClick={(event) => event.preventDefault()}
        >
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase backdrop-blur-md ring-1 ring-inset ring-white/10",
              getAgeRecommendationColor(show.recommendedAge, true),
            )}
          >
            {show.recommendedAge}+
          </span>
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
                : "text-muted-foreground hover:bg-red-500/5",
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
              onEdit={() => onEdit(show)}
              onDelete={() => onDelete(show)}
            />
          </div>
        </div>
      </div>

      <Link to={routes.route.tvshowDetail(show.title)} className="block p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">
          Sinopse
        </p>
        <p className="line-clamp-2 text-sm text-foreground/70 leading-relaxed italic">
          "{show.description}"
        </p>
      </Link>
    </div>
  );
};
