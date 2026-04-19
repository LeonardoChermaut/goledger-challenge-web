import { cn } from "@/lib/lib";
import { tvShowGradients } from "@/shared/constants/constants";
import { ITvShowData } from "@/shared/interfaces/interfaces";
import { routes } from "@/shared/routes/routes";
import { getAgeRecommendationColor, getGradient } from "@/shared/utils/utils";
import { Tv } from "lucide-react";
import { Link } from "react-router-dom";

type WatchlistTvShowItemProps = {
  tvShowRef: { "@key": string };
  tvShow: ITvShowData | undefined;
};

export const WatchlistTvShowItem = ({
  tvShowRef,
  tvShow,
}: WatchlistTvShowItemProps) => {
  const displayTitle = tvShow?.title ?? tvShowRef["@key"];
  const gradient = getGradient(tvShowGradients, displayTitle);

  return (
    <Link
      to={routes.route.tvshowDetail(displayTitle)}
      className="group/card glass-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      <div
        className={cn(
          "relative h-28 bg-gradient-to-br",
          gradient,
          "flex items-center justify-center",
        )}
      >
        <Tv className="h-10 w-10 text-primary/20" />
        {tvShow?.recommendedAge && (
          <span
            className={cn(
              "absolute left-3 bottom-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ring-inset ring-white/10 backdrop-blur-md",
              getAgeRecommendationColor(tvShow.recommendedAge),
            )}
          >
            {tvShow.recommendedAge}+
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading text-sm font-semibold text-foreground group-hover/card:text-primary transition-colors line-clamp-1">
          {displayTitle}
        </h3>
        {tvShow && (
          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {tvShow.description}
          </p>
        )}
      </div>
    </Link>
  );
};
