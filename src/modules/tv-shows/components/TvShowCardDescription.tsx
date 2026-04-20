import { ITvShowData } from "@/shared/interfaces/interfaces";
import { routes } from "@/shared/routes/routes";
import { Link } from "react-router-dom";

interface TvShowCardDescriptionProps {
  show: ITvShowData;
}

export const TvShowCardDescription = ({ show }: TvShowCardDescriptionProps) => {
  return (
    <Link to={routes.route.tvshowDetail(show.title)} className="block p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">
        Sinopse
      </p>
      <p className="line-clamp-2 text-sm text-foreground/70 leading-relaxed italic">
        "{show.description}"
      </p>
    </Link>
  );
};
