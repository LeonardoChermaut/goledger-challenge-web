import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { EpisodesPage } from "./modules/episodes/EpisodesPage";
import { HomePage } from "./modules/home/HomePage";
import { NotFoundPage } from "./modules/not-found/NotFoundPage";

import { SeasonsPage } from "./modules/seasons/SeasonsPage";
import { TvShowsPage } from "./modules/tv-shows/TvShowsPage";
import { WatchlistsPage } from "./modules/watchlists/WatchlistsPage";
import { routes } from "./shared/routes/routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-background font-sans antialiased">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path={routes.route.home} element={<HomePage />} />
              <Route path={routes.route.tvshows} element={<TvShowsPage />} />
              <Route path={routes.route.seasons} element={<SeasonsPage />} />
              <Route path={routes.route.episodes} element={<EpisodesPage />} />
              <Route
                path={routes.route.watchlists}
                element={<WatchlistsPage />}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
