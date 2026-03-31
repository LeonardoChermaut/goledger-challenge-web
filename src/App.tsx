import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppHeader } from "./components/AppHeader";
import { Footer } from "./components/Footer";
import { EpisodesPage } from "./modules/episodes/EpisodesPage";
import { NotFound } from "./modules/not-found/NotFoundPage";
import { SeasonsPage } from "./modules/seasons/SeasonsPage";
import { TvShowsPage } from "./modules/tv-shows/TvShowsPage";
import { WatchlistsPage } from "./modules/watchlists/WatchlistsPage";

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
          <AppHeader />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<TvShowsPage />} />
              <Route path="/seasons" element={<SeasonsPage />} />
              <Route path="/episodes" element={<EpisodesPage />} />
              <Route path="/watchlists" element={<WatchlistsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
