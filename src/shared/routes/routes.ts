import { slugify } from "../utils/utils";

export const routes = {
  route: {
    home: "/",
    tvshows: "/tvshows",
    seasons: "/seasons",
    episodes: "/episodes",
    watchlists: "/watchlists",

    tvshowDetailPattern: "/tvshows/:slug",
    seasonDetailPattern: "/seasons/:slug",
    episodeDetailPattern: "/episodes/:slug",
    watchlistDetailPattern: "/watchlists/:slug",

    tvshowDetail: (title: string) => `/tvshows/${slugify(title)}`,

    watchlistDetail: (title: string) => `/watchlists/${slugify(title)}`,

    seasonDetail: (showTitle: string, seasonNumber: number | string) =>
      `/seasons/${slugify(`${showTitle}-temporada-${seasonNumber}`)}`,

    episodeDetail: (
      showTitle: string,
      seasonNumber: number | string,
      episodeNumber: number | string,
      title: string,
    ) =>
      `/episodes/${slugify(`${showTitle}-temporada-${seasonNumber}-episodio-${episodeNumber}-${title}`)}`,
  },
  api: {
    methods: {
      search: "/api/query/search",
      updateAsset: "/api/invoke/updateAsset",
      deleteAsset: "/api/invoke/deleteAsset",
      createAsset: "/api/invoke/createAsset",
    },
  },
} as const;
