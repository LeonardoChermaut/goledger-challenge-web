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
  ISeasonPayload,
  ITvShowData,
  IWatchlistData,
} from "@/shared/interfaces/interface";
import {
  findAssetByKey,
  getTvShowAge,
  getTvShowTitle,
  sortByFavorite,
} from "@/shared/utils/utils";
import { Plus } from "lucide-react";
import { useRef } from "react";
import { SeasonCard } from "./components/SeasonCard";
import { SeasonForm } from "./components/SeasonForm";

export const SeasonsPage = () => {
  const {
    assets: { data: seasons, isLoading, error },
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
    deleteAsset: deleteSeason,
  } = useAssetManager<ISeasonPayload>({ assetType: "seasons" });

  const { toggleFavorite } = useFavorite({ watchlists });

  const resetPaginationRef = useRef<() => void>(() => {});

  const { searchTerm, filteredData, handleSearchChange } =
    useAssetSearch<ISeasonData>({
      data: seasons,
      customFilter: (item, term) =>
        getTvShowTitle(item, tvShows).toLowerCase().includes(term),
      onFilterChange: () => resetPaginationRef.current(),
    });

  const sortedSeasons = sortByFavorite(filteredData, (season) => {
    const tvShow = findAssetByKey(tvShows, season.tvShow["@key"]);
    return watchlists?.some((w) => w.title === tvShow?.title) || false;
  });

  const {
    currentPage,
    totalPages,
    paginatedData,
    onPageChange,
    resetPagination,
  } = usePagination({ data: sortedSeasons });

  resetPaginationRef.current = resetPagination;

  const { groups: groupedSeasons } = useGroupedAssets({
    data: paginatedData,
    groupBy: (season) => getTvShowTitle(season, tvShows),
  });

  const handler = useHandlers<ISeasonData>();

  const handleFormSubmit = async (formData: ISeasonFormData) => {
    const payload: ISeasonPayload = {
      tvShow: { "@assetType": "tvShows", "@key": formData.tvShow },
      number: formData.number,
      year: formData.year,
    };

    await submit(handler.editItem as ISeasonPayload | null, payload);
    handler.formDisclosure.close();
  };

  const handleDeleteConfirm = async () => {
    if (!handler.deleteItem) return;
    await deleteSeason.mutateAsync(handler.deleteItem["@key"]);
    handler.deleteDisclosure.close();
  };

  return (
    <PageShell
      title="Temporadas"
      description="Gerencie as temporadas dos programas de TV"
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
          >
            <div className="space-y-12">
              {groupedSeasons.map(([showTitle, items], index) => (
                <div key={showTitle} className="animate-fade-in">
                  {index > 0 && <hr className="mb-8 border-border/40" />}
                  <h2 className="mb-6 text-xl font-semibold text-foreground/90">
                    {showTitle}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((season) => (
                      <SeasonCard
                        key={season["@key"]}
                        season={season}
                        onEdit={handler.openEdit}
                        onDelete={handler.openDelete}
                        tvShowTitle={showTitle}
                        isFavorite={
                          watchlists?.some(
                            (w) =>
                              w.title ===
                              findAssetByKey(tvShows, season.tvShow["@key"])
                                ?.title,
                          ) || false
                        }
                        onToggleFavorite={() => {
                          const tvShow = findAssetByKey(
                            tvShows,
                            season.tvShow["@key"],
                          );
                          if (tvShow) {
                            toggleFavorite(
                              tvShow.title,
                              tvShow.description,
                              tvShow["@key"],
                            );
                          }
                        }}
                        tvShowAge={getTvShowAge(season, tvShows ?? [])}
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
        title="Remover Temporada"
        open={handler.deleteDisclosure.isOpen}
        onConfirm={handleDeleteConfirm}
        onClose={handler.deleteDisclosure.close}
        loading={deleteSeason.isPending}
        message={`Deseja remover a Temporada ${handler.deleteItem?.number} de ${getTvShowTitle(
          handler.deleteItem!,
          tvShows,
        )}? Esta acao nao pode ser desfeita.`}
      />
    </PageShell>
  );
};
