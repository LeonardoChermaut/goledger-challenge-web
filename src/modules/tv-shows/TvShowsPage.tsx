import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Modal } from "@/components/Modal";
import { PageShell } from "@/components/PageShell";
import { Pagination } from "@/components/Pagination";
import { QueryResult } from "@/components/QueryResult";
import { SearchInput } from "@/components/SearchInput";
import { useAssetSearch } from "@/hooks/use-asset-search";
import { useAssetManager } from "@/hooks/use-assets";
import { useFavorite } from "@/hooks/use-favorite";
import { useHandlers } from "@/hooks/use-handlers";
import { usePagination } from "@/hooks/use-pagination";
import {
  ITvShowData,
  ITvShowFormData,
  IWatchlistData,
} from "@/shared/interfaces/interface";
import { sortByFavorite } from "@/shared/utils/utils";
import { Plus, Tv } from "lucide-react";
import { useRef } from "react";
import { TvShowCard } from "./components/TvShowCard";
import { TvShowForm } from "./components/TvShowForm";

export const TvShowsPage = () => {
  const {
    assets: { data: tvShows, isLoading, error },
  } = useAssetManager<ITvShowData>({ assetType: "tvShows" });
  const {
    assets: { data: watchlists },
  } = useAssetManager<IWatchlistData>({ assetType: "watchlist" });

  const {
    submit,
    isSubmitting,
    deleteAsset: deleteTvShow,
  } = useAssetManager<ITvShowFormData>({ assetType: "tvShows" });

  const { isFavorite, toggleFavorite } = useFavorite({ watchlists });

  const resetPaginationRef = useRef<() => void>(() => {});

  const { searchTerm, filteredData, handleSearchChange } =
    useAssetSearch<ITvShowData>({
      data: tvShows,
      searchKey: "title",
      onFilterChange: () => resetPaginationRef.current(),
    });

  const sortedData = sortByFavorite(filteredData, (show) =>
    isFavorite(show.title),
  );

  const {
    currentPage,
    totalPages,
    paginatedData,
    onPageChange,
    resetPagination,
  } = usePagination({ data: sortedData });

  resetPaginationRef.current = resetPagination;

  const handler = useHandlers<ITvShowData>();

  const handleFormSubmit = async (formData: ITvShowFormData) => {
    await submit(handler.editItem, formData);
    handler.formDisclosure.close();
  };

  const handleDeleteConfirm = async () => {
    if (!handler.deleteItem) {
      return;
    }

    await deleteTvShow.mutateAsync(handler.deleteItem["@key"]);
    handler.deleteDisclosure.close();
  };

  return (
    <PageShell
      title="Programas de TV"
      description="Navegue e gerencie o catalogo de programas de TV"
      icon={Tv}
      action={
        <button
          onClick={handler.openCreate}
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
                  onEdit={handler.openEdit}
                  onDelete={handler.openDelete}
                  isFavorite={isFavorite(show.title)}
                  onToggleFavorite={() =>
                    toggleFavorite(show.title, show.description, show["@key"])
                  }
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
        open={handler.formDisclosure.isOpen}
        onClose={handler.formDisclosure.close}
        title={
          handler.editItem ? "Editar Programa de TV" : "Novo Programa de TV"
        }
      >
        <TvShowForm
          initialData={handler.editItem}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          isEditing={!!handler.editItem}
          onCancel={handler.formDisclosure.close}
        />
      </Modal>

      <ConfirmDialog
        open={handler.deleteDisclosure.isOpen}
        onConfirm={handleDeleteConfirm}
        onClose={handler.deleteDisclosure.close}
        loading={deleteTvShow.isPending}
        title="Remover Programa de TV"
        message={`Tem certeza que deseja remover "${handler.deleteItem?.title}"? Esta acao nao pode ser desfeita.`}
      />
    </PageShell>
  );
};
