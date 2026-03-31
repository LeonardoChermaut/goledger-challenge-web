import { useAssetSearch } from "@/hooks/use-asset-search";
import {
  useCreateAsset,
  useDeleteAsset,
  useSearchAssets,
  useUpdateAsset,
} from "@/hooks/use-assets";
import { useDisclosure } from "@/hooks/use-disclosure";
import { usePagination } from "@/hooks/use-pagination";
import { ITvShowData, IWatchlistData } from "@/shared/interfaces/interface";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { Modal } from "../../components/Modal";
import { PageShell } from "../../components/PageShell";
import { Pagination } from "../../components/Pagination";
import { QueryResult } from "../../components/QueryResult";
import { SearchInput } from "../../components/SearchInput";
import { TvShowCard } from "./components/TvShowCard";
import { TvShowForm } from "./components/TvShowForm";

const ITEMS_PER_PAGE = 9;

export const TvShowsPage = () => {
  const {
    data: tvShows,
    isLoading,
    error,
  } = useSearchAssets<ITvShowData>("tvShows");
  const { data: watchlists } = useSearchAssets<IWatchlistData>("watchlist");

  const createMutation = useCreateAsset<ITvShowData>("tvShows");
  const updateMutation = useUpdateAsset("tvShows");
  const deleteMutation = useDeleteAsset("tvShows");

  const createWatchlist = useCreateAsset<IWatchlistData>("watchlist");
  const deleteWatchlist = useDeleteAsset("watchlist");

  const formDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();

  const [editItem, setEditItem] = useState<ITvShowData | null>(null);
  const [deleteItem, setDeleteItem] = useState<ITvShowData | null>(null);

  const { searchTerm, filteredData, handleSearchChange } = useAssetSearch({
    data: tvShows,
    searchKey: "title",
    onFilterChange: () => resetPagination(),
  });

  const {
    currentPage,
    totalPages,
    paginatedData,
    onPageChange,
    resetPagination,
  } = usePagination({
    data: filteredData,
    itemsPerPage: ITEMS_PER_PAGE,
  });

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

  const handleFormSubmit = async (formData: {
    title: string;
    description: string;
    recommendedAge: number;
  }) => {
    const isNew = !editItem;
    const hasKeyChanged = editItem && formData.title !== editItem.title;

    if (isNew || hasKeyChanged) {
      if (hasKeyChanged) {
        await deleteMutation.mutateAsync({
          "@assetType": "tvShows",
          "@key": editItem["@key"],
        });
      }
      await createMutation.mutateAsync({
        "@assetType": "tvShows",
        ...formData,
      });
    } else {
      await updateMutation.mutateAsync({
        "@assetType": "tvShows",
        "@key": editItem["@key"],
        description: formData.description,
        recommendedAge: formData.recommendedAge,
      });
    }

    formDisclosure.close();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;

    await deleteMutation.mutateAsync({
      "@assetType": "tvShows",
      "@key": deleteItem["@key"],
    });

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

  const isFavorite = (showTitle: string) =>
    watchlists?.some((w) => w.title === showTitle) || false;

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

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
              isFavorite={isFavorite(show.title)}
              onToggleFavorite={handleToggleFavorite}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          ))}
        </div>
      </QueryResult>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="mt-8"
      />

      <Modal
        open={formDisclosure.isOpen}
        onClose={formDisclosure.close}
        title={editItem ? "Editar Programa de TV" : "Novo Programa de TV"}
      >
        <TvShowForm
          initialData={editItem}
          onSubmit={handleFormSubmit}
          onCancel={formDisclosure.close}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onClose={deleteDisclosure.close}
        onConfirm={handleDeleteConfirm}
        title="Remover Programa de TV"
        message={`Tem certeza que deseja remover "${deleteItem?.title}"? Esta ação não pode ser desfeita.`}
        loading={deleteMutation.isPending}
      />
    </PageShell>
  );
};
