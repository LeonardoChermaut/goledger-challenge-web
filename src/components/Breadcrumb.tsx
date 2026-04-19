import { ChevronRight, Home } from "lucide-react";
import { FunctionComponent } from "react";
import { Link } from "react-router-dom";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export const Breadcrumb: FunctionComponent<BreadcrumbProps> = ({ items }) => (
  <nav aria-label="breadcrumb" className="mb-6">
    <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
      <li>
        <Link
          to="/"
          className="flex items-center gap-1 text-muted-foreground/70 transition-colors hover:text-foreground"
        >
          <Home className="h-3.5 w-3.5" />
        </Link>
      </li>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <li key={index} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40" />
            {isLast || !item.href ? (
              <span
                aria-current={isLast ? "page" : undefined}
                className={
                  isLast
                    ? "font-medium text-foreground"
                    : "text-muted-foreground/70"
                }
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="text-muted-foreground/70 transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);
