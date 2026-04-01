import { useAssetSearch } from "@/hooks/use-asset-search";
import {
  useAssets,
  useCreateAsset,
  useDeleteAsset,
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
import { findAssetByKey } from "../../shared/utils/utils";
import { WatchlistCard } from "./components/WatchlistCard";
import { WatchlistForm } from "./components/WatchlistForm";

export const WatchlistsPage = () => {
  const {
    data: watchlists,
    isLoading,
    error,
  } = useAssets<IWatchlistData>("watchlist");
  const { data: tvShows } = useAssets<ITvShowData>("tvShows");

  const createMutation = useCreateAsset<IWatchlistData>("watchlist");
  const updateMutation = useUpdateAsset("watchlist");
  const deleteMutation = useDeleteAsset("watchlist");

  const formDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();

  const [editItem, setEditItem] = useState<IWatchlistData | null>(null);
  const [deleteItem, setDeleteItem] = useState<IWatchlistData | null>(null);

  const getTvShowTitle = (key: string): string =>
    findAssetByKey(tvShows, key)?.title ?? key;

  const { searchTerm, filteredData, handleSearchChange } = useAssetSearch({
    data: watchlists,
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
  });

  const openCreate = () => {
    setEditItem(null);
    formDisclosure.open();
  };

  const openEdit = (item: IWatchlistData) => {
    setEditItem(item);
    formDisclosure.open();
  };

  const openDelete = (item: IWatchlistData) => {
    setDeleteItem(item);
    deleteDisclosure.open();
  };

  const handleFormSubmit = async (formData: {
    title: string;
    description: string;
    tvShows: string[];
  }) => {
    const showsPayload = formData.tvShows.map((key) => ({
      "@assetType": "tvShows" as const,
      "@key": key,
    }));

    const isNew = !editItem;
    const hasKeyChanged = editItem && formData.title !== editItem.title;

    const basePayload = {
      "@assetType": "watchlist" as const,
      title: formData.title,
      description: formData.description,
      tvShows: showsPayload,
    };

    if (isNew || hasKeyChanged) {
      if (hasKeyChanged) {
        await deleteMutation.mutateAsync({
          "@assetType": "watchlist",
          "@key": editItem["@key"],
        });
      }
      await createMutation.mutateAsync(basePayload);
    } else {
      await updateMutation.mutateAsync({
        "@key": editItem["@key"],
        description: formData.description,
        tvShows: showsPayload,
      });
    }

    formDisclosure.close();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;

    await deleteMutation.mutateAsync({
      "@assetType": "watchlist",
      "@key": deleteItem["@key"],
    });

    deleteDisclosure.close();
    setDeleteItem(null);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <PageShell
      title="Minhas Listas"
      description="Crie e gerencie suas listas de favoritos"
      action={
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Nova Lista
        </button>
      }
    >
      <SearchInput
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Pesquisar listas..."
        className="mb-8"
      />

      <QueryResult
        loading={isLoading}
        error={error}
        empty={filteredData.length === 0}
        emptyMessage="Nenhuma lista encontrada."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedData.map((wl) => (
            <WatchlistCard
              key={wl["@key"]}
              watchlist={wl}
              getTvShowTitle={getTvShowTitle}
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
        title={
          editItem ? "Editar Lista de Favoritos" : "Nova Lista de Favoritos"
        }
      >
        <WatchlistForm
          initialData={
            editItem
              ? {
                  title: editItem.title,
                  description: editItem.description || "",
                  tvShows: editItem.tvShows?.map((s) => s["@key"]) || [],
                }
              : undefined
          }
          tvShows={tvShows}
          onSubmit={handleFormSubmit}
          onCancel={formDisclosure.close}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onClose={deleteDisclosure.close}
        onConfirm={handleDeleteConfirm}
        title="Remover Lista de Favoritos"
        message={`Deseja remover "${deleteItem?.title}"? Esta ação não pode ser desfeita.`}
        loading={deleteMutation.isPending}
      />
    </PageShell>
  );
};
