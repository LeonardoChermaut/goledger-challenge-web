import { DropdownMenu } from "@/components/DropdownMenu";
import { cn } from "@/lib/lib";
import { ISeasonData } from "@/shared/interfaces/interface";
import { getAgeRecommendationColor, isValidAge } from "@/shared/utils/utils";
import { Calendar, Heart, Pencil, Trash2 } from "lucide-react";
import { FunctionComponent } from "react";

type SeasonCardProps = {
  season: ISeasonData;
  tvShowTitle: string;
  tvShowAge: number | undefined;
  isFavorite: boolean;
  onEdit: (season: ISeasonData) => void;
  onDelete: (season: ISeasonData) => void;
  onToggleFavorite: (season: ISeasonData) => void;
};

export const SeasonCard: FunctionComponent<SeasonCardProps> = ({
  season,
  tvShowTitle,
  tvShowAge,
  isFavorite,
  onEdit,
  onDelete,
  onToggleFavorite,
}) => {
  const displayAge =
    tvShowAge != null && isValidAge(tvShowAge) ? tvShowAge : null;

  return (
    <div className="glass-card p-5 flex flex-col h-full gap-3 group relative hover:z-20">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{tvShowTitle}</p>
          <h3 className="font-heading text-lg font-semibold text-foreground leading-snug">
            Temporada {season.number}
          </h3>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onToggleFavorite(season)}
            className={cn(
              "rounded-full p-1.5 transition-colors",
              isFavorite
                ? "text-red-500"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
            title={
              isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
          >
            <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
          </button>

          {displayAge != null && (
            <span
              className={`rounded px-2 py-0.5 text-xs font-medium ${getAgeRecommendationColor(displayAge)}`}
            >
              {displayAge}+
            </span>
          )}

          <DropdownMenu
            options={[
              {
                label: "Editar",
                icon: <Pencil className="h-3.5 w-3.5" />,
                onClick: () => onEdit(season),
              },
              {
                label: "Remover",
                icon: <Trash2 className="h-3.5 w-3.5" />,
                onClick: () => onDelete(season),
                variant: "destructive",
              },
            ]}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-auto">
        <Calendar className="h-4 w-4 shrink-0" />
        <span>Ano de Lançamento: {season.year}</span>
      </div>
    </div>
  );
};
