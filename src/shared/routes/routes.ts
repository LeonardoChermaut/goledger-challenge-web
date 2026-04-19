import { slugify } from "../utils/utils";

export const routes = {
  route: {
    home: "/",
    tvshows: "/tvshows",
    tvshowDetail: (title: string) => `/tvshows/${slugify(title)}`,
    tvshowDetailPattern: "/tvshows/:slug",
    seasons: "/seasons",
    seasonDetail: (showTitle: string, seasonNumber: number | string) =>
      `/seasons/${slugify(`${showTitle} Temporada ${seasonNumber}`)}`,
    seasonDetailPattern: "/seasons/:slug",
    episodes: "/episodes",
    episodeDetail: (showTitle: string, seasonNumber: number | string, episodeNumber: number | string, title: string) => 
      `/episodes/${slugify(`${showTitle} S${seasonNumber} E${episodeNumber} ${title}`)}`,
    episodeDetailPattern: "/episodes/:slug",
    watchlists: "/watchlists",
    watchlistDetail: (title: string) => `/watchlists/${slugify(title)}`,
    watchlistDetailPattern: "/watchlists/:slug",
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
