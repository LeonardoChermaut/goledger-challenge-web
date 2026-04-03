import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Modal } from "@/components/Modal";
import { PageShell } from "@/components/PageShell";
import { Pagination } from "@/components/Pagination";
import { QueryResult } from "@/components/QueryResult";
import { SearchInput } from "@/components/SearchInput";
import { useAssetSearch } from "@/hooks/use-asset-search";
import { useAssetManager } from "@/hooks/use-assets";
import { useHandlers } from "@/hooks/use-handlers";
import { usePagination } from "@/hooks/use-pagination";
import {
  ITvShowData,
  IWatchlistData,
  IWatchlistFormData,
  IWatchlistPayload,
} from "@/shared/interfaces/interface";
import { findAssetByKey } from "@/shared/utils/utils";
import { Plus } from "lucide-react";
import { useRef } from "react";
import { WatchlistCard } from "./components/WatchlistCard";
import { WatchlistForm } from "./components/WatchlistForm";

export const WatchlistsPage = () => {
  const {
    assets: { data: watchlists, isLoading, error },
  } = useAssetManager<IWatchlistData>({ assetType: "watchlist" });
  const {
    assets: { data: tvShows },
  } = useAssetManager<ITvShowData>({ assetType: "tvShows" });

  const {
    submit,
    isSubmitting,
    deleteAsset: deleteWatchlist,
  } = useAssetManager<IWatchlistPayload>({ assetType: "watchlist" });

  const resetPaginationRef = useRef<() => void>(() => {});

  const { searchTerm, filteredData, handleSearchChange } =
    useAssetSearch<IWatchlistData>({
      data: watchlists,
      searchKey: "title",
      onFilterChange: () => resetPaginationRef.current(),
    });

  const {
    currentPage,
    totalPages,
    paginatedData,
    onPageChange,
    resetPagination,
  } = usePagination({ data: filteredData });

  resetPaginationRef.current = resetPagination;

  const handler = useHandlers<IWatchlistData>();

  const resolveTvShowTitle = (key: string): string =>
    findAssetByKey(tvShows, key)?.title ?? key;

  const handleFormSubmit = async (formData: IWatchlistFormData) => {
    const payload: IWatchlistPayload = {
      title: formData.title,
      description: formData.description,
      tvShows: formData.tvShows.map((key) => ({
        "@assetType": "tvShows" as const,
        "@key": key,
      })),
    };

    await submit(handler.editItem as IWatchlistPayload | null, payload);
    handler.formDisclosure.close();
  };

  const handleDeleteConfirm = async () => {
    if (!handler.deleteItem) return;
    await deleteWatchlist.mutateAsync(handler.deleteItem["@key"]);
    handler.deleteDisclosure.close();
  };

  return (
    <PageShell
      title="Minhas Listas"
      description="Crie e gerencie suas listas de favoritos"
      action={
        <button
          onClick={handler.openCreate}
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
          {paginatedData.map((watchlist) => (
            <WatchlistCard
              key={watchlist["@key"]}
              watchlist={watchlist}
              getTvShowTitle={resolveTvShowTitle}
              onEdit={handler.openEdit}
              onDelete={handler.openDelete}
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
        open={handler.formDisclosure.isOpen}
        onClose={handler.formDisclosure.close}
        title={
          handler.editItem
            ? "Editar Lista de Favoritos"
            : "Nova Lista de Favoritos"
        }
      >
        <WatchlistForm
          initialData={
            handler.editItem
              ? {
                  title: handler.editItem.title,
                  description: handler.editItem.description || "",
                  tvShows:
                    handler.editItem.tvShows?.map((tvshow) => tvshow["@key"]) ||
                    [],
                }
              : undefined
          }
          tvShows={tvShows}
          isEditing={!!handler.editItem}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          onCancel={handler.formDisclosure.close}
        />
      </Modal>

      <ConfirmDialog
        open={handler.deleteDisclosure.isOpen}
        onConfirm={handleDeleteConfirm}
        onClose={handler.deleteDisclosure.close}
        loading={deleteWatchlist.isPending}
        title="Remover Lista de Favoritos"
        message={`Deseja remover "${handler.deleteItem?.title}"? Esta acao nao pode ser desfeita.`}
      />
    </PageShell>
  );
};
