import { cn } from "@/lib/lib";
import { FunctionComponent, ReactNode } from "react";

type MetadataItemProps = {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export const MetadataItem: FunctionComponent<MetadataItemProps> = ({
  label,
  value,
  icon,
  className,
}) => (
  <div className={cn("flex flex-col gap-1", className)}>
    <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-1.5">
      {icon}
      {label}
    </dt>
    <dd className="text-sm font-medium text-foreground leading-none">
      {value}
    </dd>
  </div>
);

type EntityMetadataProps = {
  children: ReactNode;
  className?: string;
};

export const EntityMetadata: FunctionComponent<EntityMetadataProps> = ({
  children,
  className,
}) => (
  <div className={cn("glass-card p-6", className)}>
    <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </dl>
  </div>
);
