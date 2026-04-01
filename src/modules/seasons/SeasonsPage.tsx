import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Modal } from "@/components/Modal";
import { PageShell } from "@/components/PageShell";
import { Pagination } from "@/components/Pagination";
import { QueryResult } from "@/components/QueryResult";
import { SearchInput } from "@/components/SearchInput";
import { useAssetSearch } from "@/hooks/use-asset-search";
import { useAssets, useCreateAsset, useDeleteAsset } from "@/hooks/use-assets";
import { useCrudForm } from "@/hooks/use-crud-form";
import { useDisclosure } from "@/hooks/use-disclosure";
import { useGroupedAssets } from "@/hooks/use-grouped-assets";
import { usePagination } from "@/hooks/use-pagination";
import {
  ISeasonData,
  ISeasonFormData,
  ISeasonPayload,
  ITvShowData,
  IWatchlistData,
} from "@/shared/interfaces/interface";
import {
  getTvShowAge,
  getTvShowTitle,
  sortByFavorite,
} from "@/shared/utils/utils";
import { Plus } from "lucide-react";
import { useState } from "react";
import { SeasonCard } from "./components/SeasonCard";
import { SeasonForm } from "./components/SeasonForm";

export const SeasonsPage = () => {
  const { data: seasons, isLoading, error } = useAssets<ISeasonData>("seasons");
  const { data: tvShows } = useAssets<ITvShowData>("tvShows");
  const { data: watchlists } = useAssets<IWatchlistData>("watchlist");

  const deleteWatchlist = useDeleteAsset("watchlist");
  const createWatchlist = useCreateAsset("watchlist");

  const formDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();

  const [editItem, setEditItem] = useState<ISeasonData | null>(null);
  const [deleteItem, setDeleteItem] = useState<ISeasonData | null>(null);

  const {
    submit,
    isSubmitting,
    delete: deleteMutation,
  } = useCrudForm<ISeasonPayload>({
    assetType: "seasons",
  });

  const { searchTerm, filteredData, handleSearchChange } = useAssetSearch({
    data: seasons,
    customFilter: (item, term) =>
      getTvShowTitle(item, tvShows).toLowerCase().includes(term),
    onFilterChange: () => resetPagination(),
  });

  const {
    currentPage,
    totalPages,
    paginatedData,
    onPageChange,
    resetPagination,
  } = usePagination({ data: filteredData });

  const isSeasonFavorite = (season: ISeasonData): boolean => {
    const tvShow = tvShows?.find(
      (item) => item["@key"] === season.tvShow["@key"],
    );

    if (!tvShow) {
      return false;
    }

    return (
      watchlists?.some((watchlist) => watchlist.title === tvShow.title) || false
    );
  };

  const sortedSeasons = sortByFavorite(paginatedData, isSeasonFavorite);

  const { groups: groupedSeasons } = useGroupedAssets({
    data: sortedSeasons,
    groupBy: (season) => getTvShowTitle(season, tvShows),
  });

  const handleToggleFavorite = async (season: ISeasonData) => {
    const tvShow = tvShows?.find(
      (tvShow) => tvShow["@key"] === season.tvShow["@key"],
    );
    if (!tvShow) {
      return;
    }

    const favoritesList = watchlists?.find(
      (watchlist) => watchlist.title === tvShow.title,
    );

    if (favoritesList) {
      await deleteWatchlist.mutateAsync({
        "@assetType": "watchlist",
        "@key": favoritesList["@key"],
      });
    } else {
      await createWatchlist.mutateAsync({
        "@assetType": "watchlist",
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

  const openEdit = (item: ISeasonData) => {
    setEditItem(item);
    formDisclosure.open();
  };

  const openDelete = (item: ISeasonData) => {
    setDeleteItem(item);
    deleteDisclosure.open();
  };

  const handleFormSubmit = async (formData: ISeasonFormData) => {
    const payload: ISeasonPayload = {
      tvShow: { "@assetType": "tvShows", "@key": formData.tvShow },
      number: formData.number,
      year: formData.year,
    };

    await submit(editItem as ISeasonPayload | null, payload);
    formDisclosure.close();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) {
      return;
    }

    await deleteMutation.mutateAsync(deleteItem["@key"]);
    deleteDisclosure.close();
    setDeleteItem(null);
  };

  return (
    <PageShell
      title="Temporadas"
      description="Gerencie as temporadas dos programas de TV"
      action={
        <button
          onClick={openCreate}
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
                        onEdit={openEdit}
                        onDelete={openDelete}
                        tvShowTitle={showTitle}
                        isFavorite={isSeasonFavorite(season)}
                        onToggleFavorite={handleToggleFavorite}
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
        open={formDisclosure.isOpen}
        onClose={formDisclosure.close}
        title={editItem ? "Editar Temporada" : "Nova Temporada"}
      >
        <SeasonForm
          initialData={
            editItem
              ? {
                  tvShow: editItem.tvShow["@key"],
                  number: editItem.number,
                  year: editItem.year,
                }
              : undefined
          }
          tvShows={tvShows}
          onSubmit={handleFormSubmit}
          onCancel={formDisclosure.close}
          isSubmitting={isSubmitting}
          isEditing={!!editItem}
        />
      </Modal>

      <ConfirmDialog
        title="Remover Temporada"
        open={deleteDisclosure.isOpen}
        onConfirm={handleDeleteConfirm}
        onClose={deleteDisclosure.close}
        loading={deleteMutation.isPending}
        message={`Deseja remover a Temporada ${deleteItem?.number} de ${getTvShowTitle(
          deleteItem!,
          tvShows,
        )}? Esta ação não pode ser desfeita.`}
      />
    </PageShell>
  );
};
