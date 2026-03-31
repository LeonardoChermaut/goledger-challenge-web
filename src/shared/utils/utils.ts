export const isValidRating = (value: number): boolean => {
  if (value < 0 || value > 10) return false;

  const stringValue = value.toString();
  const decimalPart = stringValue.split('.')[1];

  return !decimalPart || decimalPart.length === 1;
};

export const getAgeRecommendationColor = (age: number): string => {
  if (age <= 10) return "bg-green-500/15 text-green-600"; // Infantil
  if (age < 18) return "bg-yellow-500/15 text-yellow-600"; // Adolescente
  return "bg-red-500/15 text-red-600"; // Adulto (+18)
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
