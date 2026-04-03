import { navigationItems } from "@/shared/constants/constants";
import { routes } from "@/shared/routes/routes";
import { Tv } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to={routes.route.home} className="flex items-center gap-2">
          <Tv className="h-6 w-6 text-primary" />
          <span className="font-heading text-xl font-bold text-foreground">
            GoShow<span className="text-primary">DB</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
