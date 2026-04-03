import { ArrowLeft, Tv } from "lucide-react";
import { Link } from "react-router-dom";
import { routes } from "@/shared/routes/routes";

export const NotFoundPage = () => {
  return (
    <div className="animate-fade-in">
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="container relative py-24">
          <div className="mx-auto max-w-lg text-center">
            <h1 className="font-heading text-7xl font-bold tracking-tight sm:text-8xl">
              <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
                404
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-muted-foreground">
              A pagina que voce procura nao existe ou foi movida.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                to={routes.route.home}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para o Inicio
              </Link>
              <Link
                to={routes.route.tvshows}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                <Tv className="h-4 w-4" />
                Explorar Catalogo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
