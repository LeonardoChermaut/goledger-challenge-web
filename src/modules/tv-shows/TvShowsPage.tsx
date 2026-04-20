import { FunctionComponent } from "react";
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
import { TvShowGrid } from "./components/TvShowGrid";
import { TvShowListEmpty } from "./components/TvShowListEmpty";
import { TvShowForm } from "./components/TvShowForm";

const TvShowListSection: FunctionComponent<{
  shows: ITvShowData[];
  onEdit: (show: ITvShowData) => void;
  onDelete: (show: ITvShowData) => void;
  isFavorite: (key: string) => boolean;
  isFavoritePending: (key: string) => boolean;
  onToggleFavorite: (title: string, description: string, key: string) => void;
}> = ({
  shows,
  onEdit,
  onDelete,
  isFavorite,
  isFavoritePending,
  onToggleFavorite,
}) => {
  if (shows.length === 0) {
    return <TvShowListEmpty />;
  }

  return (
    <TvShowGrid
      shows={shows}
      onEdit={onEdit}
      onDelete={onDelete}
      isFavorite={isFavorite}
      isFavoritePending={isFavoritePending}
      onToggleFavorite={onToggleFavorite}
    />
  );
};

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
            <TvShowListSection
              shows={sortedPaginatedData}
              onEdit={handler.openEdit}
              onDelete={handler.openDelete}
              isFavorite={isFavorite}
              isFavoritePending={isPending}
              onToggleFavorite={toggleFavorite}
            />
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
