import { ReactNode } from "react";

type PageShellProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

export const PageShell = ({
  title,
  description,
  action,
  children,
}: PageShellProps) => (
  <div className="container py-8 animate-fade-in">
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 className="font-heading text-3xl font-bold text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
    {children}
  </div>
);
