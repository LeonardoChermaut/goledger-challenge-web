import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Modal } from "@/components/Modal";
import { PageShell } from "@/components/PageShell";
import { Pagination } from "@/components/Pagination";
import { QueryResult } from "@/components/QueryResult";
import { SearchInput } from "@/components/SearchInput";
import { AssetListGroup } from "@/components/AssetListGroup";
import { useAssetSearch } from "@/hooks/use-asset-search";
import { useAssetManager } from "@/hooks/use-assets";
import { useFavorite } from "@/hooks/use-favorite";
import { useGroupedAssets } from "@/hooks/use-grouped-assets";
import { useHandlers } from "@/hooks/use-handlers";
import { usePagination } from "@/hooks/use-pagination";
import { IEpisodeData, IEpisodeFormData } from "@/shared/interfaces/interfaces";
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
    submit,
    isSubmitting,
    deleteAsset: deleteEpisode,
  } = useAssetManager("episodes");

  const {
    assets: { data: seasons },
  } = useAssetManager("seasons");

  const {
    assets: { data: tvShows },
  } = useAssetManager("tvShows");

  const {
    assets: { data: watchlists },
  } = useAssetManager("watchlist");

  const { isFavorite, isPending, toggleFavorite } = useFavorite({ watchlists });

  const handler = useHandlers<IEpisodeData>();

  const isEpisodeFavorite = (episode: IEpisodeData) => {
    const season = findAssetByKey(seasons, episode.season["@key"]);
    return season ? isFavorite(season.tvShow["@key"]) : false;
  };

  const getEpisodeTvShowKey = (episode: IEpisodeData) => {
    const season = findAssetByKey(seasons, episode.season["@key"]);
    return season?.tvShow["@key"];
  };

  const handleToggleFavorite = (episode: IEpisodeData) => {
    const season = findAssetByKey(seasons, episode.season["@key"]);
    if (!season) {
      return;
    }

    const tvShow = findAssetByKey(tvShows, season.tvShow["@key"]);
    if (tvShow) {
      toggleFavorite(tvShow.title, tvShow.description, tvShow["@key"]);
    }
  };

  const { resetPagination } = usePagination({ data: episodes });

  const { searchTerm, filteredData, handleSearchChange } = useAssetSearch({
    data: episodes,
    customFilter: (item, term) =>
      getTvShowTitleFromEpisode(item, seasons ?? [], tvShows ?? [])
        .toLowerCase()
        .includes(term) || item.title.toLowerCase().includes(term),
    onFilterChange: resetPagination,
  });

  const initialSorted = [...(filteredData ?? [])].sort((a, b) => {
    const showA = getTvShowTitleFromEpisode(a, seasons ?? [], tvShows ?? []);
    const showB = getTvShowTitleFromEpisode(b, seasons ?? [], tvShows ?? []);
    if (showA !== showB) return showA.localeCompare(showB);

    const seasonA =
      seasons?.find((s) => s["@key"] === a.season["@key"])?.number || 0;
    const seasonB =
      seasons?.find((s) => s["@key"] === b.season["@key"])?.number || 0;
    if (seasonA !== seasonB) return Number(seasonA) - Number(seasonB);

    return Number(a.episodeNumber) - Number(b.episodeNumber);
  });

  const sortedEpisodes = sortByFavorite(initialSorted, isEpisodeFavorite);

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

  const handleFormSubmit = async (formData: IEpisodeFormData) => {
    const payload: Omit<IEpisodeData, "@key"> = {
      "@assetType": "episodes",
      ...formData,
      season: { "@assetType": "seasons", "@key": formData.season },
      releaseDate: formData.releaseDate
        ? new Date(formData.releaseDate).toISOString()
        : "",
      rating: formData.rating ? Number(formData.rating) : undefined,
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
      title="Episódios"
      description="Gerencie os episódios de todas as temporadas"
      icon={PlayCircle}
      action={
        <button
          onClick={handler.openCreate}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Adicionar Episódio
        </button>
      }
    >
      <SearchInput
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Pesquisar por série ou título..."
        className="mb-8"
      />

      <div className="flex flex-col min-h-[60vh]">
        <div className="flex-grow">
          <QueryResult
            loading={isLoading}
            error={error}
            empty={filteredData.length === 0}
            emptyMessage="Nenhum episódio encontrado."
            onRetry={() => refetch()}
          >
            <AssetListGroup
              groups={groupedEpisodes}
              renderItem={(episode) => {
                const season = findAssetByKey(seasons, episode.season["@key"]);
                const tvShow = season
                  ? findAssetByKey(tvShows, season.tvShow["@key"])
                  : null;
                const tvShowTitle = tvShow?.title ?? "";
                const seasonNumber = season?.number ?? 0;
                const tvShowKey = getEpisodeTvShowKey(episode);

                return (
                  <EpisodeCard
                    key={episode["@key"]}
                    episode={episode}
                    onEdit={handler.openEdit}
                    onDelete={handler.openDelete}
                    isFavorite={isEpisodeFavorite(episode)}
                    isFavoritePending={tvShowKey ? isPending(tvShowKey) : false}
                    onToggleFavorite={() => handleToggleFavorite(episode)}
                    seasonLabel={getEpisodeSeasonLabel(
                      episode,
                      seasons ?? [],
                      tvShows ?? [],
                    )}
                    seasonNumber={seasonNumber}
                    tvShowTitle={tvShowTitle}
                    tvShowAge={getTvShowAgeFromEpisode(
                      episode,
                      seasons ?? [],
                      tvShows ?? [],
                    )}
                  />
                );
              }}
            />
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
    </PageShell>
  );
};
