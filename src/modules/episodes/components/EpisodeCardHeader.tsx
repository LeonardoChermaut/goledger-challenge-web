import { IEpisodeData } from "@/shared/interfaces/interfaces";
import { routes } from "@/shared/routes/routes";
import { PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";

type EpisodeCardHeaderProps = {
  episode: IEpisodeData;
  seasonLabel: string;
  seasonNumber: number;
  tvShowTitle: string;
  gradient: string;
};

export const EpisodeCardHeader = ({
  episode,
  seasonLabel,
  seasonNumber,
  tvShowTitle,
  gradient,
}: EpisodeCardHeaderProps) => {
  return (
    <div className={`relative h-36 bg-gradient-to-br ${gradient}`}>
      <Link
        to={routes.route.episodeDetail(
          tvShowTitle,
          seasonNumber,
          episode.episodeNumber,
          episode.title,
        )}
        aria-label={`Ver detalhes do episódio ${episode.episodeNumber}: ${episode.title}`}
        className="absolute inset-0 flex flex-col justify-end"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayCircle className="h-12 w-12 text-primary/20 mt-10" />
        </div>
        <div className="p-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {episode.title}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
              <span className="line-clamp-1">{seasonLabel}</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>E{episode.episodeNumber}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
