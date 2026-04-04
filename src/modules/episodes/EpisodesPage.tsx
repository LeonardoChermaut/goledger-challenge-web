import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Modal } from "@/components/Modal";
import { PageShell } from "@/components/PageShell";
import { Pagination } from "@/components/Pagination";
import { QueryResult } from "@/components/QueryResult";
import { SearchInput } from "@/components/SearchInput";
import { useAssetSearch } from "@/hooks/use-asset-search";
import { useAssetManager } from "@/hooks/use-assets";
import { useFavorite } from "@/hooks/use-favorite";
import { useGroupedAssets } from "@/hooks/use-grouped-assets";
import { useHandlers } from "@/hooks/use-handlers";
import { usePagination } from "@/hooks/use-pagination";
import {
  IEpisodeData,
  IEpisodeFormData,
  ISeasonData,
  ITvShowData,
  IWatchlistData,
} from "@/shared/interfaces/interfaces";
import {
  findAssetByKey,
  getEpisodeSeasonLabel,
  getTvShowAgeFromEpisode,
  getTvShowTitleFromEpisode,
  sortByFavorite,
} from "@/shared/utils/utils";
import { PlayCircle, Plus } from "lucide-react";
import { EpisodeCard } from "./components/EpisodeCard";
import { EpisodeForm } from "./components/EpisodeForm";

export const EpisodesPage = () => {
  const {
    assets: { data: episodes, isLoading, error, refetch },
  } = useAssetManager<IEpisodeData>({ assetType: "episodes" });
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

  const {
    isFavorite: isWatchlistFavorite,
    isPending,
    toggleFavorite,
  } = useFavorite({ watchlists });

  const handler = useHandlers<IEpisodeData>();

  const { resetPagination } = usePagination({ data: episodes });

  const { searchTerm, filteredData, handleSearchChange } =
    useAssetSearch<IEpisodeData>({
      data: episodes,
      customFilter: (item, term) => {
        const season = findAssetByKey(seasons, item.season["@key"]);
        if (!season) {
          return item.title.toLowerCase().includes(term);
        }

        const tvShow = findAssetByKey(tvShows, season.tvShow["@key"]);
        const tvShowTitle = tvShow?.title ?? "";

        return (
          item.title.toLowerCase().includes(term) ||
          tvShowTitle.toLowerCase().includes(term) ||
          String(season.number).includes(term)
        );
      },
      onFilterChange: resetPagination,
    });

  const getEpisodeTvShowKey = (episode: IEpisodeData): string | null => {
    const season = findAssetByKey(seasons, episode.season["@key"]);
    if (!season) {
      return null;
    }

    return season.tvShow["@key"];
  };

  const isEpisodeFavorite = (episode: IEpisodeData): boolean => {
    const tvShowKey = getEpisodeTvShowKey(episode);
    if (!tvShowKey) {
      return false;
    }

    return isWatchlistFavorite(tvShowKey);
  };

  const sortedEpisodes = sortByFavorite(filteredData ?? [], isEpisodeFavorite);

  const {
    currentPage: sortedPage,
    totalPages: sortedTotalPages,
    paginatedData: sortedPaginatedData,
    onPageChange,
  } = usePagination({ data: sortedEpisodes });

  const { groups: groupedEpisodes } = useGroupedAssets({
    data: sortedPaginatedData,
    groupBy: (episode) =>
      getTvShowTitleFromEpisode(episode, seasons ?? [], tvShows ?? []),
  });

  const handleToggleFavorite = async (ep: IEpisodeData) => {
    const season = findAssetByKey(seasons, ep.season["@key"]);
    if (!season) {
      return;
    }

    const tvShow = findAssetByKey(tvShows, season.tvShow["@key"]);
    if (!tvShow) {
      return;
    }

    await toggleFavorite(tvShow.title, tvShow.description, tvShow["@key"]);
  };

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
  };

  return (
    <PageShell
      title="Episodios"
      description="Navegue e gerencie os episodios"
      icon={PlayCircle}
      action={
        <button
          onClick={handler.openCreate}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Adicionar Episodio
        </button>
      }
    >
      <SearchInput
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Pesquisar episodios..."
        className="mb-8"
      />

      <div className="flex flex-col min-h-[60vh]">
        <div className="flex-grow">
          <QueryResult
            loading={isLoading}
            error={error}
            empty={filteredData.length === 0}
            emptyMessage="Nenhum episodio encontrado."
            onRetry={() => refetch()}
          >
            <div className="space-y-12">
              {groupedEpisodes.map(([showTitle, items], index) => (
                <div key={showTitle} className="animate-fade-in">
                  {index > 0 && <hr className="mb-8 border-border/40" />}
                  <h2 className="mb-6 text-xl font-semibold text-foreground/90">
                    {showTitle}
                  </h2>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((episode) => {
                      const tvShowKey = getEpisodeTvShowKey(episode);
                      return (
                        <EpisodeCard
                          key={episode["@key"]}
                          episode={episode}
                          onEdit={handler.openEdit}
                          onDelete={handler.openDelete}
                          isFavorite={isEpisodeFavorite(episode)}
                          isFavoritePending={
                            tvShowKey ? isPending(tvShowKey) : false
                          }
                          onToggleFavorite={() => handleToggleFavorite(episode)}
                          seasonLabel={getEpisodeSeasonLabel(
                            episode,
                            seasons ?? [],
                            tvShows ?? [],
                          )}
                          tvShowAge={getTvShowAgeFromEpisode(
                            episode,
                            seasons ?? [],
                            tvShows ?? [],
                          )}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </QueryResult>
        </div>

        <Pagination
          currentPage={sortedPage}
          totalPages={sortedTotalPages}
          onPageChange={onPageChange}
          className="mt-8"
        />
      </div>

      <Modal
        open={handler.formDisclosure.isOpen}
        onClose={handler.formDisclosure.close}
        title={handler.editItem ? "Editar Episodio" : "Novo Episodio"}
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
        title="Remover Episodio"
        message={`Deseja remover o Episodio ${handler.deleteItem?.episodeNumber} de "${handler.deleteItem?.title}"? Esta acao nao pode ser desfeita.`}
        loading={deleteEpisode.isPending}
      />
    </PageShell>
  );
};
