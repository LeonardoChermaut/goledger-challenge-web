import { ConfirmDialog } from "@/components/ConfirmDialog";
import { DetailActionBar } from "@/components/DetailActionBar";
import { DetailHero } from "@/components/DetailHero";
import { Modal } from "@/components/Modal";
import { useAssetBySlug, useAssetManager } from "@/hooks/use-assets";
import { useHandlers } from "@/hooks/use-handlers";
import { cn } from "@/lib/lib";
import {
  tvShowGradients,
  watchlistGradients,
} from "@/shared/constants/constants";
import {
  ITvShowData,
  IWatchlistData,
  IWatchlistFormData,
} from "@/shared/interfaces/interfaces";
import { routes } from "@/shared/routes/routes";
import {
  findAssetByKey,
  getAgeRecommendationColor,
  getGradient,
} from "@/shared/utils/utils";
import { BookmarkPlus, Tv } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { WatchlistForm } from "./components/WatchlistForm";

export const WatchlistDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const {
    data: watchlist,
    isLoading,
    error,
    refetch,
  } = useAssetBySlug<IWatchlistData>({ assetType: "watchlist", slug });

  const {
    assets: { data: tvShows },
  } = useAssetManager<ITvShowData>({ assetType: "tvShows" });

  const {
    submit,
    isSubmitting,
    deleteAsset: deleteWatchlist,
  } = useAssetManager<IWatchlistData>({ assetType: "watchlist" });

  const handler = useHandlers<IWatchlistData>();

  const gradient = watchlist
    ? getGradient(watchlistGradients, watchlist.title)
    : "";

  const handleFormSubmit = async (formData: IWatchlistFormData) => {
    const payload: Omit<IWatchlistData, "@key"> = {
      "@assetType": "watchlist",
      title: formData.title,
      description: formData.description,
      tvShows: formData.tvShows.map((k) => ({
        "@assetType": "tvShows" as const,
        "@key": k,
      })),
    };
    await submit(handler.editItem, payload);
    handler.formDisclosure.close();
  };

  const handleDeleteConfirm = async () => {
    if (!handler.deleteItem) {
      return;
    }

    await deleteWatchlist.mutateAsync(handler.deleteItem["@key"]);
    handler.deleteDisclosure.close();
    navigate(routes.route.watchlists);
  };

  const showCount = watchlist?.tvShows?.length ?? 0;

  return (
    <div className="animate-fade-in">
      <DetailHero
        Icon={BookmarkPlus}
        gradient={gradient}
        isLoading={isLoading}
        error={error}
        isEmpty={!watchlist && !isLoading}
        onRetry={() => refetch()}
        breadcrumbs={[
          { label: "Minhas Listas", href: routes.route.watchlists },
          { label: watchlist?.title ?? "Detalhes" },
        ]}
        actions={
          watchlist && (
            <DetailActionBar
              onEdit={() => handler.openEdit(watchlist)}
              onDelete={() => handler.openDelete(watchlist)}
            />
          )
        }
      >
        {watchlist && (
          <>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {watchlist.title}
            </h1>
            <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
              {showCount} {showCount === 1 ? "título salvo" : "títulos salvos"}
            </p>
          </>
        )}
      </DetailHero>

      {watchlist && (
        <section className="container py-8 space-y-8">
          {watchlist.description && (
            <div className="glass-card p-6 border-l-2 border-l-primary/30">
              <h2 className="mb-3 font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground/60">
                Sobre esta lista
              </h2>
              <p className="text-sm leading-relaxed text-foreground/80 italic">
                "{watchlist.description}"
              </p>
            </div>
          )}

          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-heading text-xl font-semibold text-foreground flex items-center gap-2">
                <Tv className="h-5 w-5 text-primary" />
                Conteúdo da Lista
              </h2>
              <Link
                to={routes.route.tvshows}
                className="text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:text-primary/80"
              >
                Explorar catálogo →
              </Link>
            </div>

            {!watchlist.tvShows || watchlist.tvShows.length === 0 ? (
              <div className="glass-card flex flex-col items-center justify-center py-12 text-center border-dashed">
                <BookmarkPlus className="mb-3 h-10 w-10 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">
                  Esta lista ainda está vazia.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {watchlist.tvShows.map((tvShowRef) => {
                  const tvShow = findAssetByKey(tvShows, tvShowRef["@key"]);
                  const displayTitle = tvShow?.title ?? tvShowRef["@key"];
                  const tg = getGradient(tvShowGradients, displayTitle);

                  return (
                    <Link
                      key={tvShowRef["@key"]}
                      to={routes.route.tvshowDetail(displayTitle)}
                      className="group/card glass-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                    >
                      <div
                        className={cn(
                          "relative h-28 bg-gradient-to-br",
                          tg,
                          "flex items-center justify-center",
                        )}
                      >
                        <Tv className="h-10 w-10 text-primary/20" />
                        {tvShow?.recommendedAge && (
                          <span
                            className={cn(
                              "absolute left-3 bottom-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ring-inset ring-white/10 backdrop-blur-md",
                              getAgeRecommendationColor(tvShow.recommendedAge),
                            )}
                          >
                            {tvShow.recommendedAge}+
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-heading text-sm font-semibold text-foreground group-hover/card:text-primary transition-colors line-clamp-1">
                          {displayTitle}
                        </h3>
                        {tvShow && (
                          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {tvShow.description}
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
        title={handler.editItem ? "Editar Lista" : "Nova Lista"}
      >
        <WatchlistForm
          initialData={
            handler.editItem
              ? {
                  title: handler.editItem.title,
                  description: handler.editItem.description || "",
                  tvShows:
                    handler.editItem.tvShows?.map((tv) => tv["@key"]) || [],
                }
              : undefined
          }
          tvShows={tvShows}
          isEditing={!!handler.editItem}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          onCancel={handler.formDisclosure.close}
        />
      </Modal>

      <ConfirmDialog
        open={handler.deleteDisclosure.isOpen}
        onConfirm={handleDeleteConfirm}
        onClose={handler.deleteDisclosure.close}
        loading={deleteWatchlist.isPending}
        title="Remover Lista"
        message={`Deseja excluir "${handler.deleteItem?.title}"?`}
      />
    </div>
  );
};
