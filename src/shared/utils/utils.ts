import {
  IEpisodeData,
  ISeasonData,
  ITvShowData,
} from "../interfaces/interfaces";

export const encodeKey = (key: string) =>
  encodeURIComponent(btoa(unescape(encodeURIComponent(key))));

export const decodeKey = (encoded: string) => {
  try {
    const keyPart = encoded.includes("--")
      ? encoded.split("--").pop()!
      : encoded;

    if (!keyPart) {
      return encoded;
    }

    return decodeURIComponent(escape(atob(decodeURIComponent(keyPart))));
  } catch (e) {
    return encoded;
  }
};

export const slugify = (text: string): string =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

export const isValidRating = (value: number): boolean => {
  if (value < 0 || value > 10) {
    return false;
  }

  const stringValue = value.toString();
  const decimalPart = stringValue.split(".")[1];

  return !decimalPart || decimalPart.length === 1;
};

export const getGradient = (
  gradients: readonly string[],
  title: string,
): string => {
  let hash = 0;

  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }

  return gradients[Math.abs(hash) % gradients.length];
};

export const isValidAge = (age: number): boolean => age >= 0 && age <= 18;

export const isValidEpisodeRating = (rating: number): boolean =>
  rating >= 0 && rating <= 10;

export const isValidReleaseYear = (
  itemYear: number,
  seriesYear: number,
): boolean => itemYear >= seriesYear;

export const getAgeRecommendationColor = (
  age: number,
  showBackground: boolean = false,
): string => {
  if (age <= 10) {
    return showBackground ? "bg-green-500/20 text-green-600" : "text-green-600";
  }

  if (age < 18) {
    return showBackground
      ? "bg-yellow-500/20 text-yellow-600"
      : "text-yellow-600";
  }

  return showBackground ? "bg-red-400/20 text-red-600" : "text-red-600";
};

export const getRatingColor = (
  rating: number,
  showBackground: boolean = false,
): string => {
  if (!rating || rating <= 0) {
    return showBackground
      ? "bg-secondary text-muted-foreground"
      : "text-muted-foreground";
  }

  if (rating >= 8) {
    return showBackground ? "bg-green-500/20 text-green-600" : "text-green-600";
  }

  if (rating >= 7) {
    return showBackground ? "bg-green-400/20 text-green-700" : "text-green-700";
  }

  if (rating >= 5) {
    return showBackground
      ? "bg-yellow-500/20 text-yellow-600"
      : "text-yellow-600";
  }

  return showBackground ? "bg-red-400/20 text-red-600" : "text-red-600";
};

export const findAssetByKey = <T extends { "@key": string }>(
  assets: T[] | undefined,
  key: string,
): T | undefined => assets?.find((asset) => asset["@key"] === key);

export const formatSeasonLabel = (
  showTitle: string | undefined,
  seasonNumber: number | string,
): string => `${showTitle ?? "Desconhecido"} - Temporada ${seasonNumber}`;

export const getTvShowTitle = (
  season: ISeasonData,
  tvShows: ITvShowData[],
): string =>
  (season && findAssetByKey(tvShows, season.tvShow["@key"])?.title) ||
  season?.tvShow["@key"];

export const getTvShowAge = (
  season: ISeasonData,
  tvShows: ITvShowData[],
): number | undefined =>
  findAssetByKey(tvShows, season.tvShow["@key"])?.recommendedAge;

export const getEpisodeTvShowAge = (
  episodeSeasonKey: string,
  seasons: ISeasonData[],
  tvShows: ITvShowData[],
): number | undefined => {
  const season = findAssetByKey(seasons, episodeSeasonKey);

  if (!season) {
    return undefined;
  }

  return getTvShowAge(season, tvShows);
};

export const getTvShowAgeFromEpisode = (
  episode: IEpisodeData,
  seasons: ISeasonData[],
  tvShows: ITvShowData[],
): number | undefined =>
  getEpisodeTvShowAge(episode.season["@key"], seasons, tvShows);

export const formatReleaseYear = (dateString: string): string => {
  if (!dateString) {
    return "Sem data";
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Sem data";
  }

  return date.getFullYear().toString();
};

export const formatReleaseDate = (dateString: string): string => {
  if (!dateString) {
    return "Sem data";
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Sem data";
  }

  return date.toLocaleDateString("pt-BR");
};

export const getEpisodeDisplayDate = (
  episode: IEpisodeData,
  tvShowAge: number | undefined,
): string => {
  if (!episode.releaseDate) {
    return "Sem data";
  }

  const releaseYear = new Date(episode.releaseDate).getFullYear();

  if (tvShowAge != null && isValidAge(tvShowAge)) {
    if (!isValidReleaseYear(releaseYear, tvShowAge)) {
      return "Ano inválido";
    }
  }

  return formatReleaseDate(episode.releaseDate);
};

export const getEpisodeSeasonLabel = (
  episode: IEpisodeData,
  seasons: ISeasonData[],
  tvShows: ITvShowData[],
): string => {
  const season = findAssetByKey(seasons, episode.season["@key"]);

  if (!season) {
    return "Desconhecido";
  }

  const tvShow = findAssetByKey(tvShows, season.tvShow["@key"]);

  return formatSeasonLabel(
    tvShow?.title ?? season.tvShow["@key"],
    season.number,
  );
};

export const getTvShowTitleFromEpisode = (
  episode: IEpisodeData,
  seasons: ISeasonData[],
  tvShows: ITvShowData[],
): string => {
  const season = findAssetByKey(seasons, episode.season["@key"]);

  if (!season) {
    return "Desconhecido";
  }

  const tvShow = findAssetByKey(tvShows, season.tvShow["@key"]);

  return tvShow?.title ?? "Desconhecido";
};

export const sortByFavorite = <T>(
  items: T[],
  isFavoriteCallback: (item: T) => boolean,
): T[] => {
  return [...items].sort((currentItem, nextItem) => {
    const currentIsFavorite = isFavoriteCallback(currentItem);
    const nextIsFavorite = isFavoriteCallback(nextItem);

    if (currentIsFavorite && !nextIsFavorite) {
      return -1;
    }

    if (!currentIsFavorite && nextIsFavorite) {
      return 1;
    }

    return 0;
  });
};

export const sortSeasons = (seasons: ISeasonData[]): ISeasonData[] =>
  [...seasons].sort((firstSeason, secondSeason) => {
    const firstNum = Number(firstSeason.number);
    const secondNum = Number(secondSeason.number);
    return firstNum - secondNum;
  });

export const sortEpisodes = (episodes: IEpisodeData[]): IEpisodeData[] =>
  [...episodes].sort((firstEpisode, secondEpisode) => {
    const firstNum = Number(firstEpisode.episodeNumber);
    const secondNum = Number(secondEpisode.episodeNumber);
    return firstNum - secondNum;
  });
