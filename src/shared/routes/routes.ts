export const routes = {
  route: {
    home: "/",
    tvshows: "/tvshows",
    seasons: "/seasons",
    episodes: "/episodes",
    watchlists: "/watchlists",
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
