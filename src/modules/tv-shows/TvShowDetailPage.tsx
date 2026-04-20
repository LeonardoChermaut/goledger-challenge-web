import { ConfirmDialog } from "@/components/ConfirmDialog";
import { DetailActionBar } from "@/components/DetailActionBar";
import { DetailHero } from "@/components/DetailHero";
import { Modal } from "@/components/Modal";
import { useAssetBySlug, useAssetManager } from "@/hooks/use-assets";
import { useFavorite } from "@/hooks/use-favorite";
import { useHandlers } from "@/hooks/use-handlers";
import { cn } from "@/lib/lib";
import { tvShowGradients } from "@/shared/constants/constants";
import { ITvShowData, ITvShowFormData } from "@/shared/interfaces/interfaces";
import { routes } from "@/shared/routes/routes";
import { getAgeRecommendationColor, getGradient } from "@/shared/utils/utils";
import { Film, Tv } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TvShowForm } from "./components/TvShowForm";
import { SeasonGridItem } from "./components/SeasonGridItem";

export const TvShowDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const {
    data: show,
    isLoading,
    error,
    refetch,
  } = useAssetBySlug({ assetType: "tvShows", slug });

  const {
    assets: { data: seasons },
  } = useAssetManager("seasons");

  const {
    assets: { data: watchlists },
  } = useAssetManager("watchlist");

  const {
    submit,
    isSubmitting,
    deleteAsset: deleteTvShow,
  } = useAssetManager("tvShows");

  const { isFavorite, isPending, toggleFavorite } = useFavorite({ watchlists });

  const handler = useHandlers<ITvShowData>();

  const relatedSeasons = seasons
    ?.filter((season) => show && season.tvShow["@key"] === show["@key"])
    .sort((a, b) => Number(a.number) - Number(b.number));

  const handleFormSubmit = async (formData: ITvShowFormData) => {
    const payload: Omit<ITvShowData, "@key"> = {
      "@assetType": "tvShows",
      title: formData.title,
      description: formData.description,
      ...formData,
    };

    await submit(handler.editItem, payload);
    handler.formDisclosure.close();
  };

  const handleDeleteConfirm = async () => {
    if (!handler.deleteItem) {
      return;
    }

    await deleteTvShow.mutateAsync(handler.deleteItem["@key"]);
    handler.deleteDisclosure.close();
    navigate(routes.route.tvshows);
  };

  const gradient = show ? getGradient(tvShowGradients, show.title) : "";
  const favorited = show ? isFavorite(show["@key"]) : false;
  const favPending = show ? isPending(show["@key"]) : false;

  return (
    <div className="animate-fade-in group/page">
      <DetailHero
        Icon={Tv}
        gradient={gradient}
        isLoading={isLoading}
        error={error}
        isEmpty={!show && !isLoading}
        onRetry={() => refetch()}
        breadcrumbs={[
          { label: "Programas de TV", href: routes.route.tvshows },
          { label: show?.title ?? "Detalhes" },
        ]}
        actions={
          show && (
            <DetailActionBar
              onEdit={() => handler.openEdit(show)}
              onDelete={() => handler.openDelete(show)}
              favorite={{
                isFavorite: favorited,
                isPending: favPending,
                onToggle: () =>
                  toggleFavorite(show.title, show.description, show["@key"]),
                label: favorited
                  ? "Remover dos favoritos"
                  : "Adicionar aos favoritos",
              }}
            />
          )
        }
      >
        {show && (
          <>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl truncate">
              {show.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  getAgeRecommendationColor(show.recommendedAge),
                )}
              >
                {show.recommendedAge}+
              </span>
              <span className="text-xs font-medium text-muted-foreground/70">
                {relatedSeasons?.length ?? 0}{" "}
                {relatedSeasons?.length === 1 ? "temporada" : "temporadas"}
              </span>
            </div>
          </>
        )}
      </DetailHero>

      {show && (
        <section className="container py-8 space-y-10">
          <div className="glass-card p-6 border-l-2 border-l-primary/30">
            <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground/60">
              Descrição
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80 italic">
              "{show.description}"
            </p>
          </div>

          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2">
                <Film className="h-5 w-5 text-primary" />
                Temporadas
              </h2>
              <Link
                to={routes.route.seasons}
                className="text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:text-primary/80"
              >
                Explorar todas →
              </Link>
            </div>

            {!relatedSeasons || relatedSeasons.length === 0 ? (
              <div className="glass-card flex flex-col items-center justify-center py-12 text-center border-dashed">
                <Film className="mb-3 h-10 w-10 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">
                  Nenhuma temporada cadastrada.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedSeasons.map((season) => (
                  <SeasonGridItem
                    key={season["@key"]}
                    season={season}
                    showTitle={show.title}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <Modal
        open={handler.formDisclosure.isOpen}
        onClose={handler.formDisclosure.close}
        title={handler.editItem ? "Editar Programa" : "Novo Programa"}
      >
        <TvShowForm
          initialData={handler.editItem}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          isEditing={!!handler.editItem}
          onCancel={handler.formDisclosure.close}
        />
      </Modal>

      <ConfirmDialog
        open={handler.deleteDisclosure.isOpen}
        onConfirm={handleDeleteConfirm}
        onClose={handler.deleteDisclosure.close}
        loading={deleteTvShow.isPending}
        title="Remover Registro"
        message={`Deseja realmente excluir "${handler.deleteItem?.title}"?`}
      />
    </div>
  );
};
