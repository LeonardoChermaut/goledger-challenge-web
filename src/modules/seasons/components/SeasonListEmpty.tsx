import { Film } from "lucide-react";

export const SeasonListEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Film className="h-12 w-12 text-muted-foreground/50" />
      <p className="mt-4 text-muted-foreground">
        Nenhuma temporada encontrada.
      </p>
    </div>
  );
};
