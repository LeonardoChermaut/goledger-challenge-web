import { ITvShowData } from "@/shared/interfaces/interfaces";
import { getGradient } from "@/shared/utils/utils";
import { seasonGradients } from "@/shared/constants/constants";
import { TvShowCardHeader } from "./TvShowCardHeader";
import { TvShowCardActions } from "./TvShowCardActions";
import { TvShowCardDescription } from "./TvShowCardDescription";

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
      <TvShowCardHeader show={show} gradient={gradient} />
      <TvShowCardActions
        show={show}
        isFavorite={isFavorite}
        isPending={isFavoritePending}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleFavorite={onToggleFavorite}
      />
      <TvShowCardDescription show={show} />
    </div>
  );
};
