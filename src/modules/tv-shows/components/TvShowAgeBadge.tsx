import { cn } from "@/lib/lib";
import { getAgeRecommendationColor } from "@/shared/utils/utils";

type TvShowAgeBadgeProps = {
  age: number;
};

export const TvShowAgeBadge = ({ age }: TvShowAgeBadgeProps) => {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase backdrop-blur-md ring-1 ring-inset ring-white/10",
        getAgeRecommendationColor(age, true),
      )}
    >
      {age}+
    </span>
  );
};
