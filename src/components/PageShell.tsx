import { FunctionComponent, ReactNode } from "react";

type PageShellProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  description?: string;
};

export const PageShell: FunctionComponent<PageShellProps> = ({
  title,
  description,
  action,
  children,
}) => (
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
