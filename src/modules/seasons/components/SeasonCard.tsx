import { Pencil, Trash2 } from "lucide-react";
import { FunctionComponent } from "react";
import { DropdownMenu } from "../../../components/DropdownMenu";
import { ISeasonData } from "../../../shared/interfaces/interface";

type SeasonCardProps = {
  season: ISeasonData;
  tvShowTitle: string;
  onEdit: (season: ISeasonData) => void;
  onDelete: (season: ISeasonData) => void;
};

export const SeasonCard: FunctionComponent<SeasonCardProps> = ({
  season,
  tvShowTitle,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="glass-card p-5 flex flex-col h-full gap-2 group relative hover:z-20">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{tvShowTitle}</p>
          <h3 className="font-heading text-lg font-semibold text-foreground leading-snug">
            Temporada {season.number}
          </h3>
        </div>

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
      <p className="text-sm text-muted-foreground mt-auto">
        Ano: {season.year}
      </p>
    </div>
  );
};
