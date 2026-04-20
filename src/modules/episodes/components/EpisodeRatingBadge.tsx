import { Star } from "lucide-react";

type EpisodeRatingBadgeProps = {
  rating: number | null;
};

export const EpisodeRatingBadge = ({ rating }: EpisodeRatingBadgeProps) => {
  if (rating == null || rating <= 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black text-foreground backdrop-blur-md border border-white/10">
      <Star className="h-2.5 w-2.5 fill-current text-primary" />
      {rating.toFixed(1)}
    </div>
  );
};
