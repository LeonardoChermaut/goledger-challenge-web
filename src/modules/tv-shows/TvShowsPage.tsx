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
import { ITvShowData, ITvShowFormData } from "@/shared/interfaces/interfaces";
import { sortByFavorite } from "@/shared/utils/utils";
import { Plus, Tv } from "lucide-react";
import { TvShowCard } from "./components/TvShowCard";
import { TvShowForm } from "./components/TvShowForm";

export const TvShowsPage = () => {
  const {
    assets: { data: tvShows, isLoading, error, refetch },
    submit,
    isSubmitting,
    deleteAsset: deleteTvShow,
  } = useAssetManager("tvShows");

  const {
    assets: { data: watchlists },
  } = useAssetManager("watchlist");

  const { isFavorite, isPending, toggleFavorite } = useFavorite({ watchlists });

  const handler = useHandlers<ITvShowData>();

  const { resetPagination } = usePagination({ data: tvShows });

  const { searchTerm, filteredData, handleSearchChange } = useAssetSearch({
    data: tvShows,
    onFilterChange: resetPagination,
  });

  const sortedTvShows = sortByFavorite(filteredData ?? [], (show) =>
    isFavorite(show["@key"]),
  );

  const {
    currentPage: sortedPage,
    totalPages: sortedTotalPages,
    paginatedData: sortedPaginatedData,
    onPageChange,
  } = usePagination({ data: sortedTvShows });

  const handleFormSubmit = async (formData: ITvShowFormData) => {
    const payload: Omit<ITvShowData, "@key"> = {
      "@assetType": "tvShows",
      ...formData,
    };

    await submit(handler.editItem, payload);
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
      description="Gerencie seu catálogo de séries e programas"
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
        placeholder="Pesquisar por título..."
        className="mb-8"
      />

      <div className="flex flex-col min-h-[60vh]">
        <div className="flex-grow">
          <QueryResult
            loading={isLoading}
            error={error}
            empty={filteredData.length === 0}
            emptyMessage="Nenhum programa de TV encontrado."
            onRetry={() => refetch()}
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedPaginatedData.map((show) => (
                <TvShowCard
                  key={show["@key"]}
                  show={show}
                  onEdit={handler.openEdit}
                  onDelete={handler.openDelete}
                  isFavorite={isFavorite(show["@key"])}
                  isFavoritePending={isPending(show["@key"])}
                  onToggleFavorite={() =>
                    toggleFavorite(show.title, show.description, show["@key"])
                  }
                />
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
        title={handler.editItem ? "Editar Programa" : "Novo Programa"}
      >
        <TvShowForm
          initialData={handler.editItem}
          onSubmit={handleFormSubmit}
          onCancel={handler.formDisclosure.close}
          isSubmitting={isSubmitting}
          isEditing={!!handler.editItem}
        />
      </Modal>

      <ConfirmDialog
        open={handler.deleteDisclosure.isOpen}
        onConfirm={handleDeleteConfirm}
        onClose={handler.deleteDisclosure.close}
        loading={deleteTvShow.isPending}
        title="Remover Registro"
        message={`Deseja realmente remover o programa "${handler.deleteItem?.title}"?`}
      />
    </PageShell>
  );
};
