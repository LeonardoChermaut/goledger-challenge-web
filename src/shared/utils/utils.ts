import { ISeasonData, ITvShowData } from '../interfaces/interface';

export const isValidRating = (value: number): boolean => {
  if (value < 0 || value > 10) return false;

  const stringValue = value.toString();
  const decimalPart = stringValue.split('.')[1];

  return !decimalPart || decimalPart.length === 1;
};

export const getAgeRecommendationColor = (age: number): string => {
  if (age <= 10) return "bg-green-500/15 text-green-600";
  if (age < 18) return "bg-yellow-500/15 text-yellow-600";
  return "bg-red-500/15 text-red-600";
};

export const findAssetByKey = <T extends { "@key": string }>(
  assets: T[] | undefined,
  key: string
): T | undefined => {
  return assets?.find((a) => a["@key"] === key);
};

export const formatSeasonLabel = (
  showTitle: string | undefined,
  seasonNumber: number | string
): string => {
  return `${showTitle ?? "Desconhecido"} - Temporada ${seasonNumber}`;
};

export const getTvShowTitle = (
  season: ISeasonData,
  tvShows: ITvShowData[],
): string =>
  (season && findAssetByKey(tvShows, season.tvShow["@key"])?.title) ||
  season?.tvShow["@key"];
