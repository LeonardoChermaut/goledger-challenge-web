import { routes } from "@/shared/routes/routes";
import { BookmarkPlus, Film, Github, PlayCircle, Tv } from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { path: routes.route.tvshows, label: "Programas de TV", icon: Tv },
  { path: routes.route.seasons, label: "Temporadas", icon: Film },
  { path: routes.route.episodes, label: "Episodios", icon: PlayCircle },
  { path: routes.route.watchlists, label: "Minhas Listas", icon: BookmarkPlus },
] as const;

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background/90 backdrop-blur-md">
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link to={routes.route.home} className="flex items-center gap-2">
              <Tv className="h-6 w-6 text-primary" />
              <span className="font-heading text-xl font-bold text-foreground">
                GoShow<span className="text-primary">DB</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              A melhor plataforma para gerenciar e acompanhar seus programas de
              TV, temporadas e episodios favoritos.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/LeonardoChermaut"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Github"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Navegacao
            </h3>
            <ul className="grid gap-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Suporte
            </h3>
            <ul className="grid gap-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Documentacao
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Ajuda & Suporte
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Termos de Uso
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Newsletter
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Receba as ultimas novidades sobre series e filmes.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="email"
                placeholder="Seu e-mail..."
                className="flex flex-1 rounded-md border border-input bg-secondary px-3 py-1.5 text-sm ring-inset focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Assinar
              </button>
            </div>
          </div>
        </div>

        <hr className="my-8 border-border/50" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} GoShowDB. Todos os direitos
            reservados.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Privacidade
            </a>
            <a
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
