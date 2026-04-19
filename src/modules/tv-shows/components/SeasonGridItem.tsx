import { seasonGradients } from "@/shared/constants/constants";
import { ISeasonData } from "@/shared/interfaces/interfaces";
import { routes } from "@/shared/routes/routes";
import { getGradient } from "@/shared/utils/utils";
import { Calendar, Film } from "lucide-react";
import { Link } from "react-router-dom";

type SeasonGridItemProps = {
  season: ISeasonData;
  showTitle: string;
};

export const SeasonGridItem = ({ season, showTitle }: SeasonGridItemProps) => {
  const gradient = getGradient(seasonGradients, showTitle);

  return (
    <Link
      to={routes.route.seasonDetail(showTitle, season.number)}
      className="group/card glass-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      <div
        className={`relative h-24 bg-gradient-to-br ${gradient} flex items-center justify-center`}
      >
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/card:opacity-100 transition-opacity" />
        <Film className="h-8 w-8 text-primary/20" />
      </div>
      <div className="p-4">
        <p className="font-heading text-sm font-semibold text-foreground group-hover/card:text-primary transition-colors">
          Temporada {season.number}
        </p>
        <div className="mt-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
          <Calendar className="h-3 w-3" />
          <span>{season.year}</span>
        </div>
      </div>
    </Link>
  );
};
