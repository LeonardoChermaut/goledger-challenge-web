import { ReactNode } from "react";

type AssetListGroupProps<T> = {
  groups: [string, T[]][];
  renderItem: (item: T, groupTitle: string) => ReactNode;
};

export const AssetListGroup = <T,>({
  groups,
  renderItem,
}: AssetListGroupProps<T>) => {
  return (
    <div className="space-y-12">
      {groups.map(([title, items], index) => (
        <div key={title} className="animate-fade-in">
          {index > 0 && <hr className="mb-8 border-border/40" />}

          <h2 className="mb-6 text-xl font-semibold text-foreground/90">
            {title}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => renderItem(item, title))}
          </div>
        </div>
      ))}
    </div>
  );
};
