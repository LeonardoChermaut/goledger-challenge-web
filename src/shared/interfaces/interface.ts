export interface ITvShowData {
  "@assetType": "tvShows";
  "@key": string;
  "@lastTouchBy"?: string;
  "@lastTx"?: string;
  "@lastTxID"?: string;
  "@lastUpdated"?: string;
  title: string;
  description: string;
  recommendedAge: number;
}

export interface ISeasonData {
  "@assetType": "seasons";
  "@key": string;
  "@lastTouchBy"?: string;
  "@lastTx"?: string;
  "@lastTxID"?: string;
  "@lastUpdated"?: string;
  number: number;
  tvShow: { "@assetType": "tvShows"; "@key": string; title?: string };
  year: number;
}

export interface IEpisodeData {
  "@assetType": "episodes";
  "@key": string;
  "@lastTouchBy"?: string;
  "@lastTx"?: string;
  "@lastTxID"?: string;
  "@lastUpdated"?: string;
  season: { "@assetType": "seasons"; "@key": string };
  episodeNumber: number;
  title: string;
  releaseDate: string;
  description: string;
  rating?: number;
}

export interface IWatchlistData {
  "@assetType": "watchlist";
  "@key": string;
  "@lastTouchBy"?: string;
  "@lastTx"?: string;
  "@lastTxID"?: string;
  "@lastUpdated"?: string;
  title: string;
  description?: string;
  tvShows?: Array<{ "@assetType": "tvShows"; "@key": string; title?: string }>;
}

export interface ISearchResponseData<T> {
  metadata: unknown;
  result: T[];
}

export interface ICreateAssetPayloadData {
  asset: Array<Record<string, unknown>>;
}

export interface IUpdateAssetPayloadData {
  update: Record<string, unknown>;
}

export interface IDeleteAssetPayloadData {
  key: Record<string, unknown>;
}

export interface ITvShowFormData {
  title: string;
  description: string;
  recommendedAge: number;
}

export interface ISeasonFormData {
  tvShow: string;
  number: number;
  year: number;
}

export interface IEpisodeFormData {
  season: string;
  episodeNumber: number;
  title: string;
  releaseDate: string;
  description: string;
  rating?: number;
}

export interface IWatchlistFormData {
  title: string;
  description: string;
  tvShows: string[];
}

export interface IWatchlistPayload {
  title: string;
  description: string;
  tvShows: Array<{ "@assetType": "tvShows"; "@key": string }>;
}

export interface ISeasonPayload {
  tvShow: { "@assetType": "tvShows"; "@key": string };
  number: number;
  year: number;
}

export interface IEpisodePayload {
  season: { "@assetType": "seasons"; "@key": string };
  episodeNumber: number;
  title: string;
  releaseDate: string;
  description: string;
  rating?: number;
}
