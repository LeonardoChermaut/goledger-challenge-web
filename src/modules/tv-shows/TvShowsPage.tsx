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
import { usePagination } from "@/hooks/use-pagination";
import {
  ITvShowData,
  ITvShowFormData,
  IWatchlistData,
} from "@/shared/interfaces/interface";
import { sortByFavorite } from "@/shared/utils/utils";
import { Plus } from "lucide-react";
import { useState } from "react";
import { TvShowCard } from "./components/TvShowCard";
import { TvShowForm } from "./components/TvShowForm";

export const TvShowsPage = () => {
  const { data: tvShows, isLoading, error } = useAssets<ITvShowData>("tvShows");
  const { data: watchlists } = useAssets<IWatchlistData>("watchlist");

  const deleteWatchlist = useDeleteAsset("watchlist");
  const createWatchlist = useCreateAsset("watchlist");

  const formDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();

  const [editItem, setEditItem] = useState<ITvShowData | null>(null);
  const [deleteItem, setDeleteItem] = useState<ITvShowData | null>(null);

  const {
    submit,
    isSubmitting,
    delete: deleteMutation,
  } = useCrudForm<ITvShowFormData>({
    assetType: "tvShows",
    keyFields: ["title"],
  });

  const { searchTerm, filteredData, handleSearchChange } = useAssetSearch({
    data: tvShows,
    searchKey: "title",
    onFilterChange: () => resetPagination(),
  });

  const isTvShowFavorite = (show: ITvShowData): boolean =>
    watchlists?.some((watchlist) => watchlist.title === show.title) || false;

  const sortedData = sortByFavorite(filteredData, isTvShowFavorite);

  const {
    currentPage,
    totalPages,
    paginatedData,
    onPageChange,
    resetPagination,
  } = usePagination({ data: sortedData });

  const openCreate = () => {
    setEditItem(null);
    formDisclosure.open();
  };

  const openEdit = (item: ITvShowData) => {
    setEditItem(item);
    formDisclosure.open();
  };

  const openDelete = (item: ITvShowData) => {
    setDeleteItem(item);
    deleteDisclosure.open();
  };

  const handleFormSubmit = async (formData: ITvShowFormData) => {
    await submit(editItem, formData);
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

  const handleToggleFavorite = async (show: ITvShowData) => {
    const favoritesList = watchlists?.find((w) => w.title === show.title);

    if (favoritesList) {
      await deleteWatchlist.mutateAsync({
        "@assetType": "watchlist",
        "@key": favoritesList["@key"],
      });
    } else {
      await createWatchlist.mutateAsync({
        "@assetType": "watchlist",
        title: show.title,
        description: show.description,
        tvShows: [{ "@assetType": "tvShows", "@key": show["@key"] }],
      });
    }
  };

  return (
    <PageShell
      title="Programas de TV"
      description="Navegue e gerencie o catálogo de programas de TV"
      action={
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Adicionar Programa
        </button>
      }
    >
      <SearchInput
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Pesquisar programas de TV..."
        className="mb-8"
      />

      <div className="flex flex-col min-h-[60vh]">
        <div className="flex-grow">
          <QueryResult
            loading={isLoading}
            error={error}
            empty={filteredData.length === 0}
            emptyMessage="Nenhum programa de TV encontrado."
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedData.map((show) => (
                <TvShowCard
                  key={show["@key"]}
                  show={show}
                  onEdit={openEdit}
                  onDelete={openDelete}
                  isFavorite={isTvShowFavorite(show)}
                  onToggleFavorite={handleToggleFavorite}
                />
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
        title={editItem ? "Editar Programa de TV" : "Novo Programa de TV"}
      >
        <TvShowForm
          initialData={editItem}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          onCancel={formDisclosure.close}
        />
      </Modal>

      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onConfirm={handleDeleteConfirm}
        onClose={deleteDisclosure.close}
        loading={deleteMutation.isPending}
        title="Remover Programa de TV"
        message={`Tem certeza que deseja remover "${deleteItem?.title}"? Esta ação não pode ser desfeita.`}
      />
    </PageShell>
  );
};
