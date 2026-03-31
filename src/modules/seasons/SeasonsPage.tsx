import { useAssetSearch } from "@/hooks/use-asset-search";
import {
  useCreateAsset,
  useDeleteAsset,
  useSearchAssets,
  useUpdateAsset,
} from "@/hooks/use-assets";
import { useDisclosure } from "@/hooks/use-disclosure";
import { usePagination } from "@/hooks/use-pagination";
import { ISeasonData, ITvShowData } from "@/shared/interfaces/interface";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { Modal } from "../../components/Modal";
import { PageShell } from "../../components/PageShell";
import { Pagination } from "../../components/Pagination";
import { QueryResult } from "../../components/QueryResult";
import { SearchInput } from "../../components/SearchInput";
import { getTvShowTitle } from "../../shared/utils/utils";
import { SeasonCard } from "./components/SeasonCard";
import { SeasonForm } from "./components/SeasonForm";

const ITEMS_PER_PAGE = 9;

export const SeasonsPage = () => {
  const {
    data: seasons,
    isLoading,
    error,
  } = useSearchAssets<ISeasonData>("seasons");
  const { data: tvShows } = useSearchAssets<ITvShowData>("tvShows");

  const createMutation = useCreateAsset<ISeasonData>("seasons");
  const updateMutation = useUpdateAsset("seasons");
  const deleteMutation = useDeleteAsset("seasons");

  const formDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();

  const [editItem, setEditItem] = useState<ISeasonData | null>(null);
  const [deleteItem, setDeleteItem] = useState<ISeasonData | null>(null);

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
  } = usePagination({
    data: filteredData,
    itemsPerPage: ITEMS_PER_PAGE,
  });

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

  const handleFormSubmit = async (formData: {
    tvShow: string;
    number: number;
    year: number;
  }) => {
    const isNew = !editItem;
    const hasKeyChanged =
      editItem &&
      (formData.tvShow !== editItem.tvShow["@key"] ||
        formData.number !== editItem.number);

    const payload = {
      "@assetType": "seasons" as const,
      tvShow: {
        "@assetType": "tvShows" as const,
        "@key": formData.tvShow,
      },

      number: formData.number,
      year: formData.year,
    };

    if (isNew || hasKeyChanged) {
      if (hasKeyChanged) {
        await deleteMutation.mutateAsync({
          "@assetType": "seasons",
          "@key": editItem["@key"],
        });
      }
      await createMutation.mutateAsync(payload);
    } else {
      await updateMutation.mutateAsync({
        "@key": editItem["@key"],
        ...payload,
      });
    }

    formDisclosure.close();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) {
      return;
    }

    await deleteMutation.mutateAsync({
      "@assetType": "seasons",
      "@key": deleteItem["@key"],
    });

    deleteDisclosure.close();
    setDeleteItem(null);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

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

      <QueryResult
        loading={isLoading}
        error={error}
        empty={filteredData.length === 0}
        emptyMessage="Nenhuma temporada encontrada."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedData.map((season) => (
            <SeasonCard
              key={season["@key"]}
              season={season}
              tvShowTitle={getTvShowTitle(season, tvShows)}
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
        />
      </Modal>

      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onClose={deleteDisclosure.close}
        onConfirm={handleDeleteConfirm}
        title="Remover Temporada"
        message={`Deseja remover a Temporada ${deleteItem?.number} de ${getTvShowTitle(deleteItem!, tvShows)}? Esta ação não pode ser desfeita.`}
        loading={deleteMutation.isPending}
      />
    </PageShell>
  );
};
