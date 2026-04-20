import { ISeasonData, ITvShowData } from "@/shared/interfaces/interfaces";
import { findAssetByKey, getTvShowAge } from "@/shared/utils/utils";
import { FunctionComponent } from "react";
import { SeasonCard } from "./SeasonCard";

type SeasonListGroupProps = {
  groupedSeasons: [string, ISeasonData[]][];
  tvShows: ITvShowData[] | undefined;
  onEdit: (season: ISeasonData) => void;
  onDelete: (season: ISeasonData) => void;
  isFavorite: (key: string) => boolean;
  isFavoritePending: (key: string) => boolean;
  onToggleFavorite: (title: string, description: string, key: string) => void;
};

export const SeasonListGroup: FunctionComponent<SeasonListGroupProps> = ({
  groupedSeasons,
  tvShows,
  onEdit,
  onDelete,
  isFavorite,
  isFavoritePending,
  onToggleFavorite,
}) => {
  return (
    <div className="space-y-12">
      {groupedSeasons.map(([title, items], index) => (
        <div key={title} className="animate-fade-in">
          {index > 0 && <hr className="mb-8 border-border/40" />}

          <h2 className="mb-6 text-xl font-semibold text-foreground/90">
            {title}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((season) => {
              const tvShow = findAssetByKey(tvShows, season.tvShow["@key"]);
              const tvShowKey = season.tvShow["@key"];

              return (
                <SeasonCard
                  key={season["@key"]}
                  season={season}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  tvShowTitle={title}
                  isFavorite={isFavorite(tvShowKey)}
                  isFavoritePending={isFavoritePending(tvShowKey)}
                  onToggleFavorite={() => {
                    if (tvShow) {
                      onToggleFavorite(
                        tvShow.title,
                        tvShow.description,
                        tvShowKey,
                      );
                    }
                  }}
                  tvShowAge={getTvShowAge(season, tvShows ?? [])}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
