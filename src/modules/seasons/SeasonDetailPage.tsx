import { ConfirmDialog } from "@/components/ConfirmDialog";
import { DetailActionBar } from "@/components/DetailActionBar";
import { DetailHero } from "@/components/DetailHero";
import { EntityMetadata, MetadataItem } from "@/components/EntityMetadata";
import { Modal } from "@/components/Modal";
import { useAssetBySlug, useAssetManager } from "@/hooks/use-assets";
import { useFavorite } from "@/hooks/use-favorite";
import { useHandlers } from "@/hooks/use-handlers";
import { cn } from "@/lib/lib";
import {
  episodeGradients,
  seasonGradients,
} from "@/shared/constants/constants";
import { ISeasonData, ISeasonFormData } from "@/shared/interfaces/interfaces";
import { routes } from "@/shared/routes/routes";
import {
  findAssetByKey,
  formatReleaseDate,
  getAgeRecommendationColor,
  getGradient,
  getRatingColor,
  isValidAge,
} from "@/shared/utils/utils";
import { Calendar, Film, PlayCircle, Star } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SeasonForm } from "./components/SeasonForm";

export const SeasonDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const {
    data: season,
    isLoading,
    error,
    refetch,
  } = useAssetBySlug({ assetType: "seasons", slug });

  const {
    assets: { data: tvShows, isLoading: isTvShowsLoading },
  } = useAssetManager("tvShows");

  const {
    assets: { data: episodes },
  } = useAssetManager("episodes");

  const {
    assets: { data: watchlists },
  } = useAssetManager("watchlist");

  const {
    submit,
    isSubmitting,
    deleteAsset: deleteSeason,
  } = useAssetManager("seasons");

  const { isFavorite, isPending, toggleFavorite } = useFavorite({ watchlists });

  const handler = useHandlers<ISeasonData>();

  const tvShow = season
    ? findAssetByKey(tvShows, season.tvShow["@key"])
    : undefined;
  const tvShowKey = season?.tvShow["@key"];

  const relatedEpisodes = episodes?.filter(
    (ep) => season && ep.season["@key"] === season["@key"],
  );

  const favorited = tvShowKey ? isFavorite(tvShowKey) : false;
  const favPending = tvShowKey ? isPending(tvShowKey) : false;
  const displayAge =
    tvShow?.recommendedAge != null && isValidAge(tvShow.recommendedAge)
      ? tvShow.recommendedAge
      : null;
  const gradient = season
    ? getGradient(seasonGradients, tvShow?.title ?? "")
    : "";

  const handleFormSubmit = async (formData: ISeasonFormData) => {
    const payload: Omit<ISeasonData, "@key"> = {
      "@assetType": "seasons",
      tvShow: { "@assetType": "tvShows", "@key": formData.tvShow },
      number: formData.number,
      year: formData.year,
    };
    await submit(handler.editItem, payload);
    handler.formDisclosure.close();
  };

  const handleDeleteConfirm = async () => {
    if (!handler.deleteItem) {
      return;
    }

    await deleteSeason.mutateAsync(handler.deleteItem["@key"]);
    handler.deleteDisclosure.close();
    navigate(routes.route.seasons);
  };

  return (
    <div className="animate-fade-in">
      <DetailHero
        Icon={Film}
        gradient={gradient}
        isLoading={isLoading}
        error={error}
        isEmpty={!season && !isLoading}
        onRetry={() => refetch()}
        breadcrumbs={[
          { label: "Programas de TV", href: routes.route.tvshows },
          ...(tvShow
            ? [
                {
                  label: tvShow.title,
                  href: routes.route.tvshowDetail(tvShow.title),
                },
              ]
            : isTvShowsLoading
              ? [{ label: "Carregando..." }]
              : []),
          { label: season ? `Temporada ${season.number}` : "Detalhes" },
        ]}
        actions={
          season &&
          tvShow && (
            <DetailActionBar
              onEdit={() => handler.openEdit(season)}
              onDelete={() => handler.openDelete(season)}
              favorite={{
                isFavorite: favorited,
                isPending: favPending,
                onToggle: () =>
                  toggleFavorite(
                    tvShow.title,
                    tvShow.description,
                    tvShow["@key"],
                  ),
                label: favorited
                  ? "Remover dos favoritos"
                  : "Adicionar aos favoritos",
              }}
            />
          )
        }
      >
        {season && (
          <>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">
              {tvShow?.title ?? "Série"}
            </p>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Temporada {season.number}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                <Calendar className="h-3.5 w-3.5" />
                {season.year}
              </span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                {relatedEpisodes?.length ?? 0}{" "}
                {relatedEpisodes?.length === 1 ? "episódio" : "episódios"}
              </span>
            </div>
          </>
        )}
      </DetailHero>

      {season && (
        <section className="container py-8 space-y-8">
          <EntityMetadata>
            <MetadataItem
              label="Programa Original"
              value={
                tvShow ? (
                  <Link
                    to={routes.route.tvshowDetail(tvShow.title)}
                    className="text-primary hover:underline"
                  >
                    {tvShow.title}
                  </Link>
                ) : (
                  "N/A"
                )
              }
            />
            <MetadataItem label="Ano de Lançamento" value={season.year} />
            <MetadataItem
              label="Classificação"
              value={displayAge !== null ? `${displayAge}+` : "Livre"}
              className={cn(
                displayAge !== null && getAgeRecommendationColor(displayAge),
                "rounded-lg p-3 inline-flex",
              )}
            />
          </EntityMetadata>

          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-primary" />
                Episódios
              </h2>
              <Link
                to={routes.route.episodes}
                className="text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:text-primary/80"
              >
                Ver Grade →
              </Link>
            </div>

            {!relatedEpisodes || relatedEpisodes.length === 0 ? (
              <div className="glass-card flex flex-col items-center justify-center py-12 text-center border-dashed">
                <PlayCircle className="mb-3 h-10 w-10 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">
                  Nenhum episódio disponível.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedEpisodes
                  .slice()
                  .sort(
                    (a, b) => Number(a.episodeNumber) - Number(b.episodeNumber),
                  )
                  .map((ep) => {
                    const eg = getGradient(episodeGradients, ep.title);
                    const hasRating = ep.rating != null && ep.rating > 0;
                    return (
                      <Link
                        key={ep["@key"]}
                        to={routes.route.episodeDetail(
                          tvShow.title,
                          season.number,
                          ep.episodeNumber,
                          ep.title,
                        )}
                        className="group/card glass-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                      >
                        <div
                          className={cn(
                            "relative h-24 bg-gradient-to-br",
                            eg,
                            "flex items-center justify-center",
                          )}
                        >
                          <PlayCircle className="h-8 w-8 text-primary/20" />
                          {hasRating && (
                            <div
                              className={cn(
                                "absolute right-2 top-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold backdrop-blur-md",
                                getRatingColor(ep.rating, false),
                              )}
                            >
                              <Star className="h-2.5 w-2.5 fill-current" />
                              {ep.rating.toFixed(1)}
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="shrink-0 rounded-sm bg-primary/10 px-1.5 py-0.5 text-[9px] font-black text-primary uppercase">
                              E{ep.episodeNumber}
                            </span>
                            <p className="font-heading text-sm font-semibold text-foreground group-hover/card:text-primary transition-colors line-clamp-1">
                              {ep.title}
                            </p>
                          </div>
                          {ep.releaseDate && (
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                              {formatReleaseDate(ep.releaseDate)}
                            </p>
                          )}
                        </div>
                      </Link>
                    );
                  })}
              </div>
            )}
          </div>
        </section>
      )}

      <Modal
        open={handler.formDisclosure.isOpen}
        onClose={handler.formDisclosure.close}
        title={handler.editItem ? "Editar Temporada" : "Nova Temporada"}
      >
        <SeasonForm
          initialData={
            handler.editItem
              ? {
                  tvShow: handler.editItem.tvShow["@key"],
                  number: handler.editItem.number,
                  year: handler.editItem.year,
                }
              : undefined
          }
          tvShows={tvShows}
          onSubmit={handleFormSubmit}
          onCancel={handler.formDisclosure.close}
          isSubmitting={isSubmitting}
          isEditing={!!handler.editItem}
        />
      </Modal>

      <ConfirmDialog
        title="Remover Registro"
        open={handler.deleteDisclosure.isOpen}
        onConfirm={handleDeleteConfirm}
        onClose={handler.deleteDisclosure.close}
        loading={deleteSeason.isPending}
        message={`Deseja remover a Temporada ${handler.deleteItem?.number}?`}
      />
    </div>
  );
};
