import { Pencil, Star, Trash2 } from "lucide-react";
import { FunctionComponent } from "react";
import { DropdownMenu } from "../../../components/DropdownMenu";
import { IEpisodeData } from "../../../shared/interfaces/interface";

type EpisodeCardProps = {
  episode: IEpisodeData;
  seasonLabel: string;
  onEdit: (ep: IEpisodeData) => void;
  onDelete: (ep: IEpisodeData) => void;
};

export const EpisodeCard: FunctionComponent<EpisodeCardProps> = ({
  episode,
  seasonLabel,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="glass-card p-5 flex flex-col h-full gap-3 group relative transition-all duration-300 hover:shadow-xl hover:z-20">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">
            {seasonLabel} · E{episode.episodeNumber}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <h3 className="font-heading text-lg font-semibold text-foreground leading-tight">
              {episode.title}
            </h3>
            {episode.rating != null && (
              <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">
                <Star className="h-3 w-3 fill-primary" /> {episode.rating}
              </span>
            )}
          </div>
        </div>

        <DropdownMenu
          options={[
            {
              label: "Editar",
              icon: <Pencil className="h-3.5 w-3.5" />,
              onClick: () => onEdit(episode),
            },
            {
              label: "Remover",
              icon: <Trash2 className="h-3.5 w-3.5" />,
              onClick: () => onDelete(episode),
              variant: "destructive",
            },
          ]}
        />
      </div>

      <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
        {episode.description}
      </p>

      <div className="flex items-center pt-2 mt-auto">
        <span className="text-xs text-muted-foreground/80 font-medium">
          {episode.releaseDate
            ? new Date(episode.releaseDate).toLocaleDateString()
            : "Sem data"}
        </span>
      </div>
    </div>
  );
};
