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
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(
    () =>
      tvShows?.filter((s) =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()),
      ) || [],
    [tvShows, searchTerm],
  );

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    resetPagination();
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
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Pesquisar programas de TV..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full rounded-md border border-input bg-secondary pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="Falha ao carregar programas de TV." />}

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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="mt-8"
      />

      {!isLoading && filtered.length === 0 && (
        <p className="text-center py-12 text-muted-foreground">
          Nenhum programa de TV encontrado.
        </p>
      )}

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
