import {
  useCreateAsset,
  useDeleteAsset,
  useSearchAssets,
  useUpdateAsset,
} from "@/hooks/use-assets";
import { useDisclosure } from "@/hooks/use-disclosure";
import { usePagination } from "@/hooks/use-pagination";
import {
  IEpisodeData,
  ISeasonData,
  ITvShowData,
} from "@/shared/interfaces/interface";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Modal } from "../../components/Modal";
import { PageShell } from "../../components/PageShell";
import { Pagination } from "../../components/Pagination";
import {
  findAssetByKey,
  formatSeasonLabel,
} from "../../shared/utils/utils";
import { EpisodeCard } from "./components/EpisodeCard";
import { EpisodeForm } from "./components/EpisodeForm";

const ITEMS_PER_PAGE = 9;

export const EpisodesPage = () => {
  // Data Fetching
  const { data: episodes, isLoading, error } = useSearchAssets<IEpisodeData>("episodes");
  const { data: seasons } = useSearchAssets<ISeasonData>("seasons");
  const { data: tvShows } = useSearchAssets<ITvShowData>("tvShows");

  // Mutations
  const createMutation = useCreateAsset<IEpisodeData>("episodes");
  const updateMutation = useUpdateAsset("episodes");
  const deleteMutation = useDeleteAsset("episodes");

  // UI State
  const formDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();
  const [editItem, setEditItem] = useState<IEpisodeData | null>(null);
  const [deleteItem, setDeleteItem] = useState<IEpisodeData | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Helper for Labeling
  const getEpisodeSeasonLabel = (ep: IEpisodeData): string => {
    const season = findAssetByKey(seasons, ep.season["@key"]);
    if (!season) return "Desconhecido";
    const tvShow = findAssetByKey(tvShows, season.tvShow["@key"]);
    return formatSeasonLabel(tvShow?.title ?? season.tvShow["@key"], season.number);
  };

  // Filtering Logic
  const filtered = useMemo(() => {
    return episodes?.filter((e) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];
  }, [episodes, searchTerm]);

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

  const openEdit = (item: IEpisodeData) => {
    setEditItem(item);
    formDisclosure.open();
  };

  const openDelete = (item: IEpisodeData) => {
    setDeleteItem(item);
    deleteDisclosure.open();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    resetPagination();
  };

  const handleFormSubmit = async (formData: {
    season: string;
    episodeNumber: number;
    title: string;
    releaseDate: string;
    description: string;
    rating?: number;
  }) => {
    const isNew = !editItem;
    const hasKeyChanged =
      editItem &&
      (formData.season !== editItem.season["@key"] ||
        formData.episodeNumber !== editItem.episodeNumber);

    const payload = {
      "@assetType": "episodes" as const,
      season: { "@assetType": "seasons" as const, "@key": formData.season },
      episodeNumber: formData.episodeNumber,
      title: formData.title,
      releaseDate: formData.releaseDate ? new Date(formData.releaseDate).toISOString() : "",
      description: formData.description,
      rating: formData.rating,
    };

    if (isNew || hasKeyChanged) {
      if (hasKeyChanged) {
        await deleteMutation.mutateAsync({
          "@assetType": "episodes",
          "@key": editItem["@key"],
        });
      }
      await createMutation.mutateAsync(payload);
    } else {
      await updateMutation.mutateAsync({
        "@key": editItem["@key"],
        ...payload,
        releaseDate: formData.releaseDate ? new Date(formData.releaseDate).toISOString() : undefined,
      });
    }

    formDisclosure.close();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;

    await deleteMutation.mutateAsync({
      "@assetType": "episodes",
      "@key": deleteItem["@key"],
    });
    
    deleteDisclosure.close();
    setDeleteItem(null);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <PageShell
      title="Episódios"
      description="Navegue e gerencie os episódios"
      action={
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> Adicionar Episódio
        </button>
      }
    >
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Pesquisar episódios..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full rounded-md border border-input bg-secondary pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="Falha ao carregar episódios." />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedData.map((ep) => (
          <EpisodeCard
            key={ep["@key"]}
            episode={ep}
            seasonLabel={getEpisodeSeasonLabel(ep)}
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
          Nenhum episódio encontrado.
        </p>
      )}

      <Modal
        open={formDisclosure.isOpen}
        onClose={formDisclosure.close}
        title={editItem ? "Editar Episódio" : "Novo Episódio"}
      >
        <EpisodeForm
          initialData={
            editItem
              ? {
                  season: editItem.season["@key"],
                  episodeNumber: editItem.episodeNumber,
                  title: editItem.title,
                  releaseDate: editItem.releaseDate ? editItem.releaseDate.slice(0, 10) : "",
                  description: editItem.description,
                  rating: editItem.rating != null ? String(editItem.rating) : "",
                }
              : undefined
          }
          seasons={seasons}
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
        title="Remover Episódio"
        message={`Deseja remover o Episódio ${deleteItem?.episodeNumber} de "${deleteItem?.title}"? Esta ação não pode ser desfeita.`}
        loading={deleteMutation.isPending}
      />
    </PageShell>
  );
};

