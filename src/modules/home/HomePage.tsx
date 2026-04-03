import {
  featuredShows,
  features,
  quickLinks,
  stats,
} from "@/shared/constants/constants";
import { routes } from "@/shared/routes/routes";
import {
  ArrowRight,
  Calendar,
  Sparkles,
  Star,
  ThumbsUp,
  Tv,
} from "lucide-react";
import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="container relative py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Sua central de entretenimento</span>
            </div>

            <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Descubra, organize e{" "}
              <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
                acompanhe
              </span>{" "}
              suas series favoritas
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              A plataforma completa para gerenciar programas de TV, temporadas e
              episodios. Tudo em um so lugar, do seu jeito.
            </p>

            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                to={routes.route.tvshows}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Explorar Catalogo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={routes.route.watchlists}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
              >
                Minhas Listas
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border/50 bg-secondary/30">
        <div className="container py-10">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                <p className="font-heading text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Navegue pelo conteudo
          </h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Acesse rapidamente qualquer secao da plataforma
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="group glass-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <div
                className={`mb-4 inline-flex rounded-lg p-3 ${link.bg} ${link.color}`}
              >
                <link.icon className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {link.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {link.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                <span>Acessar</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border/50 bg-secondary/20">
        <div className="container py-16">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
                Destaques
              </h2>
              <p className="mt-2 text-muted-foreground">
                Programas populares que voce nao pode perder
              </p>
            </div>
            <Link
              to={routes.route.tvshows}
              className="hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80 sm:flex"
            >
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {featuredShows.map((show) => (
              <div
                key={show.title}
                className="group glass-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div
                  className={`relative h-36 bg-gradient-to-br ${show.gradient}`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Tv className="h-12 w-12 text-primary/20" />
                  </div>
                  <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm">
                    <Star className="h-3 w-3 fill-current text-primary" />
                    {show.rating}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {show.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{show.genre}</span>
                    <span>·</span>
                    <span>{show.year}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground/80">
                    {show.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Tudo que voce precisa
          </h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Ferramentas poderosas para organizar sua vida de espectador
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="glass-card p-6 transition-all hover:border-primary/20"
            >
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-heading text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border/50 bg-secondary/20">
        <div className="container py-16">
          <div className="mx-auto max-w-2xl text-center">
            <Calendar className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
              Comece agora mesmo
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Explore o catalogo, crie suas listas e nunca mais perca um
              episodio das suas series favoritas.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                to={routes.route.tvshows}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <ThumbsUp className="h-4 w-4" />
                Explorar Programas
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
