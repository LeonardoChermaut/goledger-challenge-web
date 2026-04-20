import { CardActions } from "@/components/CardActions";
import { IEpisodeData } from "@/shared/interfaces/interfaces";
import { EpisodeFavoriteButton } from "./EpisodeFavoriteButton";
import { EpisodeRatingBadge } from "./EpisodeRatingBadge";

type EpisodeCardActionsProps = {
  episode: IEpisodeData;
  isFavorite: boolean;
  isPending: boolean;
  rating: number | null;
  onToggleFavorite: () => void;
  onEdit: (episode: IEpisodeData) => void;
  onDelete: (episode: IEpisodeData) => void;
};

export const EpisodeCardActions = ({
  episode,
  isFavorite,
  isPending,
  rating,
  onEdit,
  onDelete,
  onToggleFavorite,
}: EpisodeCardActionsProps) => {
  return (
    <div
      className="absolute right-3 top-3 flex items-center gap-2"
      onClick={(event) => event.preventDefault()}
    >
      <EpisodeRatingBadge rating={rating} />
      <EpisodeFavoriteButton
        isFavorite={isFavorite}
        isPending={isPending}
        onToggle={onToggleFavorite}
      />
      <div
        onClick={(event) => event.stopPropagation()}
        className="rounded-full p-0.5"
      >
        <CardActions
          onEdit={() => onEdit(episode)}
          onDelete={() => onDelete(episode)}
        />
      </div>
    </div>
  );
};
