import {
  useCreateAsset,
  useDeleteAsset,
  useSearchAssets,
  useUpdateAsset,
} from "@/hooks/use-assets";
import { useDisclosure } from "@/hooks/use-disclosure";
import { usePagination } from "@/hooks/use-pagination";
import { ISeasonData, ITvShowData } from "@/shared/interfaces/interface";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Modal } from "../../components/Modal";
import { PageShell } from "../../components/PageShell";
import { Pagination } from "../../components/Pagination";
import { findAssetByKey } from "../../shared/utils/utils";
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

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editItem, setEditItem] = useState<ISeasonData | null>(null);
  const [deleteItem, setDeleteItem] = useState<ISeasonData | null>(null);

  const getTvShowTitle = (season: ISeasonData): string =>
    (season && findAssetByKey(tvShows, season.tvShow["@key"])?.title) ||
    season?.tvShow["@key"];

  const filtered = useMemo(
    () =>
      seasons?.filter((s) =>
        getTvShowTitle(s).toLowerCase().includes(searchTerm.toLowerCase()),
      ) || [],
    [seasons, tvShows, searchTerm],
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

  const openEdit = (item: ISeasonData) => {
    setEditItem(item);
    formDisclosure.open();
  };

  const openDelete = (item: ISeasonData) => {
    setDeleteItem(item);
    deleteDisclosure.open();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    resetPagination();
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
      tvShow: { "@assetType": "tvShows" as const, "@key": formData.tvShow },
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
    if (!deleteItem) return;

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
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Pesquisar por programa..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full rounded-md border border-input bg-secondary pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="Falha ao carregar temporadas." />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedData.map((season) => (
          <SeasonCard
            key={season["@key"]}
            season={season}
            tvShowTitle={getTvShowTitle(season)}
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
          Nenhuma temporada encontrada.
        </p>
      )}

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
        message={`Deseja remover a Temporada ${deleteItem?.number} de ${getTvShowTitle(deleteItem!)}? Esta ação não pode ser desfeita.`}
        loading={deleteMutation.isPending}
      />
    </PageShell>
  );
};
