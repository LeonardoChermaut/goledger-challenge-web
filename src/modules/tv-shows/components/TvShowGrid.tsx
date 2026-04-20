import { ITvShowData } from "@/shared/interfaces/interfaces";

import { TvShowCard } from "./TvShowCard";

type TvShowGridProps = {
  shows: ITvShowData[];
  onEdit: (show: ITvShowData) => void;
  onDelete: (show: ITvShowData) => void;
  isFavorite: (key: string) => boolean;
  isFavoritePending: (key: string) => boolean;
  onToggleFavorite: (title: string, description: string, key: string) => void;
};

export const TvShowGrid = ({
  shows,
  onEdit,
  onDelete,
  isFavorite,
  isFavoritePending,
  onToggleFavorite,
}: TvShowGridProps) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {shows.map((show) => (
        <TvShowCard
          key={show["@key"]}
          show={show}
          onEdit={onEdit}
          onDelete={onDelete}
          isFavorite={isFavorite(show["@key"])}
          isFavoritePending={isFavoritePending(show["@key"])}
          onToggleFavorite={() =>
            onToggleFavorite(show.title, show.description, show["@key"])
          }
        />
      ))}
    </div>
  );
};
