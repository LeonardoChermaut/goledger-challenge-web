import { episodeGradients } from "@/shared/constants/constants";
import { IEpisodeData } from "@/shared/interfaces/interfaces";
import {
  getGradient,
  isValidAge,
  isValidEpisodeRating,
} from "@/shared/utils/utils";
import { EpisodeCardActions } from "./EpisodeCardActions";
import { EpisodeCardDescription } from "./EpisodeCardDescription";
import { EpisodeCardHeader } from "./EpisodeCardHeader";

type EpisodeCardProps = {
  episode: IEpisodeData;
  seasonLabel: string;
  seasonNumber: number;
  tvShowTitle: string;
  tvShowAge: number | undefined;
  isFavorite: boolean;
  isFavoritePending: boolean;
  onToggleFavorite: () => void;
  onEdit: (ep: IEpisodeData) => void;
  onDelete: (ep: IEpisodeData) => void;
};

export const EpisodeCard = ({
  episode,
  seasonLabel,
  seasonNumber,
  tvShowTitle,
  tvShowAge,
  isFavorite,
  isFavoritePending,
  onEdit,
  onDelete,
  onToggleFavorite,
}: EpisodeCardProps) => {
  const displayTvShowAge =
    tvShowAge != null && isValidAge(tvShowAge) ? tvShowAge : null;

  const displayEpisodeRating =
    episode.rating != null && isValidEpisodeRating(episode.rating)
      ? episode.rating
      : null;

  const gradient = getGradient(episodeGradients, episode.title);

  return (
    <div className="group glass-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 animate-fade-in">
      <EpisodeCardHeader
        episode={episode}
        seasonLabel={seasonLabel}
        seasonNumber={seasonNumber}
        tvShowTitle={tvShowTitle}
        gradient={gradient}
      />
      <EpisodeCardActions
        episode={episode}
        isFavorite={isFavorite}
        isPending={isFavoritePending}
        rating={displayEpisodeRating}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleFavorite={onToggleFavorite}
      />
      <EpisodeCardDescription
        episode={episode}
        seasonNumber={seasonNumber}
        tvShowTitle={tvShowTitle}
        tvShowAge={displayTvShowAge}
      />
    </div>
  );
};
