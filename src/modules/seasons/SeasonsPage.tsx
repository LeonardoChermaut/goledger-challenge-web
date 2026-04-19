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
  ISeasonData,
  ISeasonFormData,
  ITvShowData,
  IWatchlistData,
} from "@/shared/interfaces/interfaces";
import {
  findAssetByKey,
  getTvShowAge,
  getTvShowTitle,
  sortByFavorite,
} from "@/shared/utils/utils";
import { Film, Plus } from "lucide-react";
import { SeasonCard } from "./components/SeasonCard";
import { SeasonForm } from "./components/SeasonForm";

export const SeasonsPage = () => {
  const {
    assets: { data: seasons, isLoading, error, refetch },
    submit,
    isSubmitting,
    deleteAsset: deleteSeason,
  } = useAssetManager<ISeasonData>({ assetType: "seasons" });
  const {
    assets: { data: tvShows },
  } = useAssetManager<ITvShowData>({ assetType: "tvShows" });
  const {
    assets: { data: watchlists },
  } = useAssetManager<IWatchlistData>({ assetType: "watchlist" });

  const { isFavorite, isPending, toggleFavorite } = useFavorite({ watchlists });

  const handler = useHandlers<ISeasonData>();

  const { resetPagination } = usePagination({ data: seasons });

  const { searchTerm, filteredData, handleSearchChange } =
    useAssetSearch<ISeasonData>({
      data: seasons,
      customFilter: (item, term) =>
        getTvShowTitle(item, tvShows ?? [])
          .toLowerCase()
          .includes(term),
      onFilterChange: resetPagination,
    });

  const sortedSeasons = sortByFavorite(filteredData ?? [], (season) =>
    isFavorite(season.tvShow["@key"]),
  );

  const {
    currentPage: sortedPage,
    totalPages: sortedTotalPages,
    paginatedData: sortedPaginatedData,
    onPageChange,
  } = usePagination({ data: sortedSeasons });

  const { groups: groupedSeasons } = useGroupedAssets({
    data: sortedPaginatedData,
    groupBy: (season) => getTvShowTitle(season, tvShows ?? []),
  });

  const handleFormSubmit = async (formData: ISeasonFormData) => {
    const payload: Omit<ISeasonData, "@key"> = {
      ...formData,
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
  };

  return (
    <PageShell
      title="Temporadas"
      description="Gerencie as temporadas dos programas de TV"
      icon={Film}
      action={
        <button
          onClick={handler.openCreate}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Adicionar Temporada
        </button>
      }
    >
      <SearchInput
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Pesquisar por programa..."
        className="mb-8"
      />

      <div className="flex flex-col min-h-[60vh]">
        <div className="flex-grow">
          <QueryResult
            loading={isLoading}
            error={error}
            empty={filteredData.length === 0}
            emptyMessage="Nenhuma temporada encontrada."
            onRetry={() => refetch()}
          >
            <div className="space-y-12">
              {groupedSeasons.map(([showTitle, items], index) => (
                <div key={showTitle} className="animate-fade-in">
                  {index > 0 && <hr className="mb-8 border-border/40" />}
                  <h2 className="mb-6 text-xl font-semibold text-foreground/90">
                    {showTitle}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((season) => {
                      const tvShow = findAssetByKey(
                        tvShows,
                        season.tvShow["@key"],
                      );
                      const tvShowKey = season.tvShow["@key"];
                      return (
                        <SeasonCard
                          key={season["@key"]}
                          season={season}
                          onEdit={handler.openEdit}
                          onDelete={handler.openDelete}
                          tvShowTitle={showTitle}
                          isFavorite={isFavorite(tvShowKey)}
                          isFavoritePending={isPending(tvShowKey)}
                          onToggleFavorite={() => {
                            if (tvShow) {
                              toggleFavorite(
                                tvShow.title,
                                tvShow.description,
                                tvShowKey,
                              );
                            }
                          }}
                          tvShowAge={getTvShowAge(season, tvShows ?? [])}
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
        message={`Deseja realmente remover este registro?`}
      />
    </PageShell>
  );
};
