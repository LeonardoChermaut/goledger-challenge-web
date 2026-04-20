import { IEpisodeData } from "@/shared/interfaces/interfaces";
import { routes } from "@/shared/routes/routes";
import {
  getAgeRecommendationColor,
  getEpisodeDisplayDate,
  isValidAge,
} from "@/shared/utils/utils";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

type EpisodeCardDescriptionProps = {
  episode: IEpisodeData;
  seasonNumber: number;
  tvShowTitle: string;
  tvShowAge: number | undefined;
};

export const EpisodeCardDescription = ({
  episode,
  seasonNumber,
  tvShowTitle,
  tvShowAge,
}: EpisodeCardDescriptionProps) => {
  const displayTvShowAge =
    tvShowAge != null && isValidAge(tvShowAge) ? tvShowAge : null;

  return (
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
            <span className={getAgeRecommendationColor(displayTvShowAge, true)}>
              {displayTvShowAge}+
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};
