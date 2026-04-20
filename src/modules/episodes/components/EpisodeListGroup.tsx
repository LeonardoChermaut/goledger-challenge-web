import { AssetListGroup } from "@/components/AssetListGroup";
import {
  IEpisodeData,
  ISeasonData,
  ITvShowData,
} from "@/shared/interfaces/interfaces";
import {
  findAssetByKey,
  getEpisodeSeasonLabel,
  getTvShowAgeFromEpisode,
} from "@/shared/utils/utils";
import { FunctionComponent } from "react";
import { EpisodeCard } from "./EpisodeCard";

type EpisodeListGroupProps = {
  groupedEpisodes: [string, IEpisodeData[]][];
  seasons: ISeasonData[] | undefined;
  tvShows: ITvShowData[] | undefined;
  onEdit: (episode: IEpisodeData) => void;
  onDelete: (episode: IEpisodeData) => void;
  isFavorite: (episode: IEpisodeData) => boolean;
  isFavoritePending: (key: string) => boolean;
  onToggleFavorite: (episode: IEpisodeData) => void;
};

export const EpisodeListGroup: FunctionComponent<EpisodeListGroupProps> = ({
  groupedEpisodes,
  seasons,
  tvShows,
  onEdit,
  onDelete,
  isFavorite,
  isFavoritePending,
  onToggleFavorite,
}) => {
  const getEpisodeTvShowKey = (episode: IEpisodeData) => {
    const season = findAssetByKey(seasons, episode.season["@key"]);
    return season?.tvShow["@key"];
  };

  return (
    <AssetListGroup
      groups={groupedEpisodes}
      renderItem={(episode) => {
        const season = findAssetByKey(seasons, episode.season["@key"]);
        const tvShow = season
          ? findAssetByKey(tvShows, season.tvShow["@key"])
          : null;
        const tvShowTitle = tvShow?.title ?? "";
        const seasonNumber = season?.number ?? 0;
        const tvShowKey = getEpisodeTvShowKey(episode);

        return (
          <EpisodeCard
            key={episode["@key"]}
            episode={episode}
            onEdit={onEdit}
            onDelete={onDelete}
            isFavorite={isFavorite(episode)}
            isFavoritePending={tvShowKey ? isFavoritePending(tvShowKey) : false}
            onToggleFavorite={() => onToggleFavorite(episode)}
            seasonLabel={getEpisodeSeasonLabel(
              episode,
              seasons ?? [],
              tvShows ?? [],
            )}
            seasonNumber={seasonNumber}
            tvShowTitle={tvShowTitle}
            tvShowAge={getTvShowAgeFromEpisode(
              episode,
              seasons ?? [],
              tvShows ?? [],
            )}
          />
        );
      }}
    />
  );
};
