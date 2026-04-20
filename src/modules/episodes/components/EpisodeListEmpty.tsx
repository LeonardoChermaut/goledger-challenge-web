import { PlayCircle } from "lucide-react";

export const EpisodeListEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <PlayCircle className="h-12 w-12 text-muted-foreground/50" />
      <p className="mt-4 text-muted-foreground">Nenhum episódio encontrado.</p>
    </div>
  );
};
