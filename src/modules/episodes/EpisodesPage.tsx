import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Modal } from "@/components/Modal";
import { PageShell } from "@/components/PageShell";
import { Pagination } from "@/components/Pagination";
import { QueryResult } from "@/components/QueryResult";
import { SearchInput } from "@/components/SearchInput";
import { useAssetSearch } from "@/hooks/use-asset-search";
import { useAssetManager, useAssets } from "@/hooks/use-assets";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useGroupedAssets } from "@/hooks/use-grouped-assets";
import { usePagination } from "@/hooks/use-pagination";
import {
  IEpisodeData,
  IEpisodeFormData,
  IEpisodePayload,
  ISeasonData,
  ITvShowData,
  IWatchlistData,
} from "@/shared/interfaces/interface";
import {
  findAssetByKey,
  getEpisodeSeasonLabel,
  getTvShowAgeFromEpisode,
  getTvShowTitleFromEpisode,
  sortByFavorite,
} from "@/shared/utils/utils";
import { Plus } from "lucide-react";
import { useState } from "react";
import { EpisodeCard } from "./components/EpisodeCard";
import { EpisodeForm } from "./components/EpisodeForm";

export const EpisodesPage = () => {
  const {
    data: episodes,
    isLoading,
    error,
  } = useAssets<IEpisodeData>("episodes");
  const { data: seasons } = useAssets<ISeasonData>("seasons");
  const { data: tvShows } = useAssets<ITvShowData>("tvShows");
  const { data: watchlists } = useAssets<IWatchlistData>("watchlist");

  const {
    submit,
    isSubmitting,
    deleteAsset: deleteEpisode,
  } = useAssetManager<IEpisodePayload>({ assetType: "episodes" });

  const { createAsset: createWatchlist, deleteAsset: deleteWatchlist } =
    useAssetManager<IWatchlistData>({ assetType: "watchlist" });

  const formDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();

  const [editItem, setEditItem] = useState<IEpisodeData | null>(null);
  const [deleteItem, setDeleteItem] = useState<IEpisodeData | null>(null);

  const { searchTerm, filteredData, handleSearchChange } = useAssetSearch({
    data: episodes,
    searchKey: "title",
    onFilterChange: () => resetPagination(),
  });

  const {
    currentPage,
    totalPages,
    paginatedData,
    onPageChange,
    resetPagination,
  } = usePagination({ data: filteredData });

  const isEpisodeFavorite = (episode: IEpisodeData): boolean => {
    const season = findAssetByKey(seasons, episode.season["@key"]);
    if (!season) return false;

    const tvShow = findAssetByKey(tvShows, season.tvShow["@key"]);
    if (!tvShow) return false;

    return watchlists?.some((w) => w.title === tvShow.title) || false;
  };

  const sortedEpisodes = sortByFavorite(paginatedData, isEpisodeFavorite);

  const { groups: groupedEpisodes } = useGroupedAssets({
    data: sortedEpisodes,
    groupBy: (episode) =>
      getTvShowTitleFromEpisode(episode, seasons ?? [], tvShows ?? []),
  });

  const handleToggleFavorite = async (ep: IEpisodeData) => {
    const season = findAssetByKey(seasons, ep.season["@key"]);
    if (!season) return;

    const tvShow = findAssetByKey(tvShows, season.tvShow["@key"]);
    if (!tvShow) return;

    const favoritesList = watchlists?.find((w) => w.title === tvShow.title);

    if (favoritesList) {
      await deleteWatchlist.mutateAsync(favoritesList["@key"]);
    } else {
      await createWatchlist.mutateAsync({
        title: tvShow.title,
        description: tvShow.description,
        tvShows: [{ "@assetType": "tvShows", "@key": tvShow["@key"] }],
      });
    }
  };

  const openCreate = () => {
    setEditItem(null);
    formDisclosure.open();
  };

  const openEdit = (item: IEpisodeData) => {
    setEditItem(item);
    formDisclosure.open();
  };

  const openDelete = (item: IEpisodeData) => {
    setDeleteItem(item);
    deleteDisclosure.open();
  };

  const handleFormSubmit = async (formData: IEpisodeFormData) => {
    const payload: IEpisodePayload = {
      season: { "@assetType": "seasons", "@key": formData.season },
      episodeNumber: formData.episodeNumber,
      title: formData.title,
      releaseDate: formData.releaseDate
        ? new Date(formData.releaseDate).toISOString()
        : "",
      description: formData.description,
      rating: formData.rating,
    };

    await submit(editItem as IEpisodePayload | null, payload);
    formDisclosure.close();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;

    await deleteEpisode.mutateAsync(deleteItem["@key"]);
    deleteDisclosure.close();
    setDeleteItem(null);
  };

  return (
    <PageShell
      title="Episódios"
      description="Navegue e gerencie os episódios"
      action={
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Adicionar Episódio
        </button>
      }
    >
      <SearchInput
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Pesquisar episódios..."
        className="mb-8"
      />

      <div className="flex flex-col min-h-[60vh]">
        <div className="flex-grow">
          <QueryResult
            loading={isLoading}
            error={error}
            empty={filteredData.length === 0}
            emptyMessage="Nenhum episódio encontrado."
          >
            <div className="space-y-12">
              {groupedEpisodes.map(([showTitle, items], index) => (
                <div key={showTitle} className="animate-fade-in">
                  {index > 0 && <hr className="mb-8 border-border/40" />}
                  <h2 className="mb-6 text-xl font-semibold text-foreground/90">
                    {showTitle}
                  </h2>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((episode) => (
                      <EpisodeCard
                        key={episode["@key"]}
                        episode={episode}
                        onEdit={openEdit}
                        onDelete={openDelete}
                        isFavorite={isEpisodeFavorite(episode)}
                        onToggleFavorite={handleToggleFavorite}
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
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </QueryResult>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="mt-8"
        />
      </div>

      <Modal
        open={formDisclosure.isOpen}
        onClose={formDisclosure.close}
        title={editItem ? "Editar Episódio" : "Novo Episódio"}
      >
        <EpisodeForm
          initialData={
            editItem
              ? {
                  season: editItem.season["@key"],
                  episodeNumber: editItem.episodeNumber,
                  title: editItem.title,
                  releaseDate: editItem.releaseDate
                    ? editItem.releaseDate.slice(0, 10)
                    : "",
                  description: editItem.description,
                  rating:
                    editItem.rating != null ? String(editItem.rating) : "",
                }
              : undefined
          }
          seasons={seasons}
          tvShows={tvShows}
          onSubmit={handleFormSubmit}
          onCancel={formDisclosure.close}
          isSubmitting={isSubmitting}
          isEditing={!!editItem}
        />
      </Modal>

      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onClose={deleteDisclosure.close}
        onConfirm={handleDeleteConfirm}
        title="Remover Episódio"
        message={`Deseja remover o Episódio ${deleteItem?.episodeNumber} de "${deleteItem?.title}"? Esta ação não pode ser desfeita.`}
        loading={deleteEpisode.isPending}
      />
    </PageShell>
  );
};
