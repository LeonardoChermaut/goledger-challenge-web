import { Tv } from "lucide-react";

export const TvShowListEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Tv className="h-12 w-12 text-muted-foreground/50" />
      <p className="mt-4 text-muted-foreground">
        Nenhum programa de TV encontrado.
      </p>
    </div>
  );
};
