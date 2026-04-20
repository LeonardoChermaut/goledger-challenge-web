import { ITvShowData } from "@/shared/interfaces/interfaces";
import { routes } from "@/shared/routes/routes";
import { Tv } from "lucide-react";
import { Link } from "react-router-dom";

type TvShowCardHeaderProps = {
  show: ITvShowData;
  gradient: string;
};

export const TvShowCardHeader = ({ show, gradient }: TvShowCardHeaderProps) => {
  return (
    <div className={`relative h-36 bg-gradient-to-br ${gradient}`}>
      <Link
        to={routes.route.tvshowDetail(show.title)}
        aria-label={`Ver detalhes de ${show.title}`}
        className="absolute inset-0 flex flex-col justify-end"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Tv className="h-12 w-12 text-primary/20" />
        </div>
        <div className="p-4">
          <h3 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {show.title}
          </h3>
        </div>
      </Link>
    </div>
  );
};
