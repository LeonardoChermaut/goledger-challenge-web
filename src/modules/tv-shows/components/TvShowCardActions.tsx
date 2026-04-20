import { CardActions } from "@/components/CardActions";
import { ITvShowData } from "@/shared/interfaces/interfaces";
import { TvShowAgeBadge } from "./TvShowAgeBadge";
import { TvShowFavoriteButton } from "./TvShowFavoriteButton";

interface TvShowCardActionsProps {
  show: ITvShowData;
  isFavorite: boolean;
  isPending: boolean;
  onEdit: (show: ITvShowData) => void;
  onDelete: (show: ITvShowData) => void;
  onToggleFavorite: () => void;
}

export const TvShowCardActions = ({
  show,
  isFavorite,
  isPending,
  onEdit,
  onDelete,
  onToggleFavorite,
}: TvShowCardActionsProps) => {
  return (
    <div
      className="absolute right-3 top-3 flex items-center gap-2"
      onClick={(event) => event.preventDefault()}
    >
      <TvShowAgeBadge age={show.recommendedAge} />
      <TvShowFavoriteButton
        isFavorite={isFavorite}
        isPending={isPending}
        onToggle={onToggleFavorite}
      />
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
  );
};
