import { ConfirmDialog } from "@/components/ConfirmDialog";
import { DetailActionBar } from "@/components/DetailActionBar";
import { DetailHero } from "@/components/DetailHero";
import { EntityMetadata, MetadataItem } from "@/components/EntityMetadata";
import { Modal } from "@/components/Modal";
import { useAssetBySlug, useAssetManager } from "@/hooks/use-assets";
import { useFavorite } from "@/hooks/use-favorite";
import { useHandlers } from "@/hooks/use-handlers";
import { cn } from "@/lib/lib";
import { episodeGradients } from "@/shared/constants/constants";
import {
  IEpisodeData,
  IEpisodeFormData,
  ISeasonData,
  ITvShowData,
  IWatchlistData,
} from "@/shared/interfaces/interfaces";
import { routes } from "@/shared/routes/routes";
import {
  findAssetByKey,
  formatReleaseDate,
  getAgeRecommendationColor,
  getGradient,
  getRatingColor,
  isValidAge,
  isValidEpisodeRating,
} from "@/shared/utils/utils";
import { Calendar, Film, PlayCircle, Star, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { EpisodeForm } from "./components/EpisodeForm";

export const EpisodeDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const {
    data: episode,
    isLoading,
    error,
    refetch,
  } = useAssetBySlug<IEpisodeData>({ assetType: "episodes", slug });

  const {
    assets: { data: seasons },
  } = useAssetManager<ISeasonData>({ assetType: "seasons" });

  const {
    assets: { data: tvShows },
  } = useAssetManager<ITvShowData>({ assetType: "tvShows" });

  const {
    assets: { data: watchlists },
  } = useAssetManager<IWatchlistData>({ assetType: "watchlist" });

  const {
    submit,
    isSubmitting,
    deleteAsset: deleteEpisode,
  } = useAssetManager<IEpisodeData>({ assetType: "episodes" });

  const { isFavorite, isPending, toggleFavorite } = useFavorite({ watchlists });

  const handler = useHandlers<IEpisodeData>();

  const season = episode
    ? findAssetByKey(seasons, episode.season["@key"])
    : undefined;
  const tvShow = season
    ? findAssetByKey(tvShows, season.tvShow["@key"])
    : undefined;
  const tvShowKey = tvShow?.["@key"];

  const favorited = tvShowKey ? isFavorite(tvShowKey) : false;
  const favPending = tvShowKey ? isPending(tvShowKey) : false;

  const displayAge =
    tvShow?.recommendedAge != null && isValidAge(tvShow.recommendedAge)
      ? tvShow.recommendedAge
      : null;

  const displayRating =
    episode?.rating != null && isValidEpisodeRating(episode.rating)
      ? episode.rating
      : null;

  const gradient = episode ? getGradient(episodeGradients, episode.title) : "";

  const handleFormSubmit = async (formData: IEpisodeFormData) => {
    const payload: Omit<IEpisodeData, "@key"> = {
      "@assetType": "episodes",
      ...formData,
      season: { "@assetType": "seasons", "@key": formData.season },
      episodeNumber: formData.episodeNumber,
      title: formData.title,
      releaseDate: formData.releaseDate
        ? new Date(formData.releaseDate).toISOString()
        : "",
      description: formData.description,
      rating: formData.rating,
    };
    await submit(handler.editItem, payload);
    handler.formDisclosure.close();
  };

  const handleDeleteConfirm = async () => {
    if (!handler.deleteItem) {
      return;
    }

    await deleteEpisode.mutateAsync(handler.deleteItem["@key"]);
    handler.deleteDisclosure.close();
    if (season) {
      navigate(
        routes.route.seasonDetail(tvShow?.title ?? "Série", season.number),
      );
    } else {
      navigate(routes.route.episodes);
    }
  };

  return (
    <div className="animate-fade-in">
      <DetailHero
        Icon={PlayCircle}
        gradient={gradient}
        isLoading={isLoading}
        error={error}
        isEmpty={!episode && !isLoading}
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
            : []),
          ...(season
            ? [
                {
                  label: `Temporada ${season.number}`,
                  href: routes.route.seasonDetail(
                    tvShow?.title ?? "Série",
                    season.number,
                  ),
                },
              ]
            : []),
          {
            label: episode
              ? `E${episode.episodeNumber}: ${episode.title}`
              : "Detalhes",
          },
        ]}
        actions={
          episode &&
          tvShow && (
            <DetailActionBar
              onEdit={() => handler.openEdit(episode)}
              onDelete={() => handler.openDelete(episode)}
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
        {episode && (
          <>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">
                {tvShow?.title ?? "Série"}
              </span>
              <span className="text-muted-foreground/40 text-[10px]">/</span>
              <span className="text-[10px] font-bold tracking-[0.1em] text-muted-foreground uppercase">
                T{season?.number ?? "?"}
              </span>
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              <span className="text-primary/40 mr-3 text-2xl font-black">
                E{episode.episodeNumber}
              </span>
              {episode.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {displayRating !== null && displayRating > 0 && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset",
                    getRatingColor(displayRating, false),
                    "ring-current/10",
                  )}
                >
                  <Star className="h-3 w-3 fill-current" />
                  {displayRating.toFixed(1)}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                <Calendar className="h-3.5 w-3.5" />
                {episode.releaseDate
                  ? formatReleaseDate(episode.releaseDate)
                  : "N/A"}
              </span>
            </div>
          </>
        )}
      </DetailHero>

      {episode && (
        <section className="container py-8 space-y-8">
          <div className="glass-card p-6 border-l-2 border-l-primary/30">
            <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground/60">
              Sinopse do Episódio
            </h2>
            <p className="text-sm leading-relaxed text-foreground/80 italic">
              "{episode.description}"
            </p>
          </div>

          <EntityMetadata>
            <MetadataItem
              label="Temporada"
              value={
                season ? `Temporada ${season.number} (${season.year})` : "N/A"
              }
              icon={<Film className="h-3 w-3" />}
            />
            <MetadataItem
              label="Data de Exibição"
              value={
                episode.releaseDate
                  ? formatReleaseDate(episode.releaseDate)
                  : "Pendente"
              }
              icon={<Calendar className="h-3 w-3" />}
            />
            <MetadataItem
              label="Classificação Etária"
              value={displayAge !== null ? `${displayAge}+ Anos` : "Livre"}
              icon={<Users className="h-3 w-3" />}
              className={cn(
                displayAge !== null && getAgeRecommendationColor(displayAge),
                "rounded-lg p-3",
              )}
            />
            <MetadataItem
              label="Avaliação Crítica"
              value={
                displayRating !== null && displayRating > 0
                  ? `${displayRating.toFixed(1)} / 10`
                  : "Ainda não avaliado"
              }
              icon={<Star className="h-3 w-3" />}
              className={cn(
                displayRating !== null && displayRating > 0
                  ? getRatingColor(displayRating, false)
                  : "text-muted-foreground",
                "rounded-lg",
              )}
            />
          </EntityMetadata>
        </section>
      )}

      <Modal
        open={handler.formDisclosure.isOpen}
        onClose={handler.formDisclosure.close}
        title={handler.editItem ? "Editar Episódio" : "Novo Episódio"}
      >
        <EpisodeForm
          initialData={
            handler.editItem
              ? {
                  season: handler.editItem.season["@key"],
                  episodeNumber: handler.editItem.episodeNumber,
                  title: handler.editItem.title,
                  releaseDate: handler.editItem.releaseDate
                    ? handler.editItem.releaseDate.slice(0, 10)
                    : "",
                  description: handler.editItem.description,
                  rating:
                    handler.editItem.rating != null
                      ? String(handler.editItem.rating)
                      : "",
                }
              : undefined
          }
          seasons={seasons}
          tvShows={tvShows}
          onSubmit={handleFormSubmit}
          onCancel={handler.formDisclosure.close}
          isSubmitting={isSubmitting}
          isEditing={!!handler.editItem}
        />
      </Modal>

      <ConfirmDialog
        open={handler.deleteDisclosure.isOpen}
        onClose={handler.deleteDisclosure.close}
        onConfirm={handleDeleteConfirm}
        title="Remover Registro"
        message={`Deseja excluir este episódio?`}
        loading={deleteEpisode.isPending}
      />
    </div>
  );
};
