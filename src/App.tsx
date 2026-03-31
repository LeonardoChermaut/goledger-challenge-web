import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppHeader } from "./components/AppHeader";
import { EpisodesPage } from "./modules/episodes/EpisodesPage";
import { SeasonsPage } from "./modules/seasons/SeasonsPage";
import { TvShowsPage } from "./modules/tv-shows/TvShowsPage";
import { WatchlistsPage } from "./modules/watchlists/WatchlistsPage";
import { NotFound } from "./pages/NotFound";

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
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppHeader />
        <Routes>
          <Route path="/" element={<TvShowsPage />} />
          <Route path="/seasons" element={<SeasonsPage />} />
          <Route path="/episodes" element={<EpisodesPage />} />
          <Route path="/watchlists" element={<WatchlistsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
