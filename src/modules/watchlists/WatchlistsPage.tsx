import {
  useCreateAsset,
  useDeleteAsset,
  useSearchAssets,
  useUpdateAsset,
} from "@/hooks/use-assets";
import { useDisclosure } from "@/hooks/use-disclosure";
import { usePagination } from "@/hooks/use-pagination";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Modal } from "../../components/Modal";
import { PageShell } from "../../components/PageShell";
import { Pagination } from "../../components/Pagination";
import { ITvShowData, IWatchlistData } from "../../shared/interfaces/interface";
import { findAssetByKey } from "../../shared/utils/utils";
import { WatchlistCard } from "./components/WatchlistCard";
import { WatchlistForm } from "./components/WatchlistForm";

const ITEMS_PER_PAGE = 9;

export const WatchlistsPage = () => {
  // Data Fetching
  const { data: watchlists, isLoading, error } = useSearchAssets<IWatchlistData>("watchlist");
  const { data: tvShows } = useSearchAssets<ITvShowData>("tvShows");

  // Mutations
  const createMutation = useCreateAsset<IWatchlistData>("watchlist");
  const updateMutation = useUpdateAsset("watchlist");
  const deleteMutation = useDeleteAsset("watchlist");

  // UI State
  const formDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();
  const [editItem, setEditItem] = useState<IWatchlistData | null>(null);
  const [deleteItem, setDeleteItem] = useState<IWatchlistData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Helper for title lookup
  const getTvShowTitle = (key: string): string =>
    findAssetByKey(tvShows, key)?.title ?? key;

  // Filtering Logic
  const filtered = useMemo(() => {
    return (
      watchlists?.filter((w) =>
        w.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) || []
    );
  }, [watchlists, searchTerm]);

  // Pagination Hook
  const {
    currentPage,
    totalPages,
    paginatedData,
    onPageChange,
    resetPagination,
  } = usePagination({
    data: filtered,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  // Event Handlers
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    resetPagination();
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
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Pesquisar listas..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full rounded-md border border-input bg-secondary pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="Falha ao carregar listas." />}

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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="mt-8"
      />

      {!isLoading && filtered.length === 0 && (
        <p className="text-center py-12 text-muted-foreground">
          Nenhuma lista encontrada.
        </p>
      )}

      <Modal
        open={formDisclosure.isOpen}
        onClose={formDisclosure.close}
        title={editItem ? "Editar Lista de Favoritos" : "Nova Lista de Favoritos"}
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

