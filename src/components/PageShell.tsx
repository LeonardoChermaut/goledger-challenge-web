import { LucideIcon } from "lucide-react";
import { FunctionComponent, ReactNode } from "react";

type PageShellProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  description?: string;
  icon?: LucideIcon;
  accentColor?: string;
};

export const PageShell: FunctionComponent<PageShellProps> = ({
  title,
  description,
  action,
  children,
  icon: Icon,
  accentColor = "from-primary/5 via-transparent to-transparent",
}) => (
  <div className="animate-fade-in">
    <section className="relative overflow-hidden border-b border-border/50">
      <div className={`absolute inset-0 bg-gradient-to-b ${accentColor}`} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <div className="container relative py-10 lg:py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            {Icon && (
              <div className="hidden rounded-xl bg-primary/10 p-3 sm:flex">
                <Icon className="h-6 w-6 text-primary" />
              </div>
            )}
            <div>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {title}
              </h1>
              {description && (
                <p className="mt-1 text-muted-foreground">{description}</p>
              )}
            </div>
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </div>
      </div>
    </section>

    <section className="container py-8">{children}</section>
  </div>
);
