import { BookmarkPlus } from "lucide-react";

export const WatchlistListEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <BookmarkPlus className="h-12 w-12 text-muted-foreground/50" />
      <p className="mt-4 text-muted-foreground">Nenhuma lista encontrada.</p>
    </div>
  );
};
