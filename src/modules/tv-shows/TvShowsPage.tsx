import {
  useCreateAsset,
  useDeleteAsset,
  useSearchAssets,
  useUpdateAsset,
} from "@/hooks/use-assets";
import { cn } from "@/lib/lib";
import { Heart, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { DropdownMenu } from "../../components/DropdownMenu";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Modal } from "../../components/Modal";
import { PageShell } from "../../components/PageShell";
import { Pagination } from "../../components/Pagination";
import { ITvShowData, IWatchlistData } from "../../shared/interfaces/interface";
import { getAgeRecommendationColor } from "../../shared/utils/utils";

const ITEMS_PER_PAGE = 9;

export const TvShowsPage = () => {
  const {
    data: tvShows,
    isLoading,
    error,
  } = useSearchAssets<ITvShowData>("tvShows");
  const createMutation = useCreateAsset<ITvShowData>("tvShows");
  const updateMutation = useUpdateAsset("tvShows");
  const deleteMutation = useDeleteAsset("tvShows");

  const { data: watchlists } = useSearchAssets<IWatchlistData>("watchlist");
  const createWatchlist = useCreateAsset<IWatchlistData>("watchlist");
  const updateWatchlist = useUpdateAsset("watchlist");
  const deleteWatchlist = useDeleteAsset("watchlist");

  const [showForm, setShowForm] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<ITvShowData | null>(null);
  const [deleteItem, setDeleteItem] = useState<ITvShowData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formState, setFormState] = useState({
    title: "",
    description: "",
    recommendedAge: "",
  });

  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleChange = (field: keyof typeof formState, value: string) =>
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));

  const openCreate = () => {
    setFormState({
      title: "",
      description: "",
      recommendedAge: "",
    });
    setEditItem(null);
    setShowForm(true);
  };

  const openEdit = (item: ITvShowData) => {
    setFormState({
      title: item.title,
      description: item.description,
      recommendedAge: String(item.recommendedAge),
    });
    setEditItem(item);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    const isNew = !editItem;
    const hasKeyChanged = editItem && formState.title !== editItem.title;

    if (isNew || hasKeyChanged) {
      if (hasKeyChanged) {
        await deleteMutation.mutateAsync({
          "@assetType": "tvShows",
          "@key": editItem["@key"],
        });
      }

      await createMutation.mutateAsync({
        "@assetType": "tvShows",
        title: formState.title,
        description: formState.description,
        recommendedAge: Number(formState.recommendedAge),
      });
    } else {
      await updateMutation.mutateAsync({
        "@assetType": "tvShows",
        "@key": editItem["@key"],
        description: formState.description,
        recommendedAge: Number(formState.recommendedAge),
      });
    }

    setShowForm(false);
  };

  const handleDelete = async () => {
    if (!deleteItem) {
      return;
    }

    await deleteMutation.mutateAsync({
      "@assetType": "tvShows",
      "@key": deleteItem["@key"],
    });
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
    watchlists?.some((w) => w.title === showTitle);

  const filtered = useMemo(() => {
    return tvShows?.filter((s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [tvShows, searchTerm]);

  const totalPages = Math.ceil((filtered?.length || 0) / ITEMS_PER_PAGE);
  const paginatedData = filtered?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

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
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full rounded-md border border-input bg-secondary pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="Falha ao carregar programas de TV." />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedData?.map((show) => (
          <div
            key={show["@key"]}
            className="glass-card p-5 flex flex-col gap-3 group relative transition-all duration-300 hover:shadow-xl hover:z-20"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-heading text-lg font-semibold text-foreground leading-tight">
                {show.title}
              </h3>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleToggleFavorite(show)}
                  className={cn(
                    "rounded-full p-1.5 transition-colors",
                    isFavorite(show.title)
                      ? "text-red-500"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                  title={
                    isFavorite(show.title)
                      ? "Remover dos favoritos"
                      : "Adicionar aos favoritos"
                  }
                >
                  <Heart
                    className={cn(
                      "h-5 w-5",
                      isFavorite(show.title) && "fill-current",
                    )}
                  />
                </button>

                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium ${getAgeRecommendationColor(show.recommendedAge)}`}
                >
                  {show.recommendedAge}+
                </span>

                <DropdownMenu
                  options={[
                    {
                      label: "Editar",
                      icon: <Pencil className="h-3.5 w-3.5" />,
                      onClick: () => openEdit(show),
                    },
                    {
                      label: "Remover",
                      icon: <Trash2 className="h-3.5 w-3.5" />,
                      onClick: () => setDeleteItem(show),
                      variant: "destructive",
                    },
                  ]}
                />
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-3 h-15 overflow-hidden">
              {show.description}
            </p>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        className="mt-8"
      />

      {filtered?.length === 0 && !isLoading && (
        <p className="text-center py-12 text-muted-foreground">
          Nenhum programa de TV encontrado.
        </p>
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editItem ? "Editar Programa de TV" : "Novo Programa de TV"}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Título
            </label>
            <input
              type="text"
              value={formState.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Descrição
            </label>
            <textarea
              value={formState.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Classificação Etária
            </label>
            <input
              type="number"
              value={formState.recommendedAge}
              onChange={(e) => handleChange("recommendedAge", e.target.value)}
              className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowForm(false)}
              className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              Cancelar
            </button>

            <button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !formState.title ||
                !formState.description ||
                !formState.recommendedAge
              }
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Remover Programa de TV"
        message={`Tem certeza que deseja remover "${deleteItem?.title}"? Esta ação não pode ser desfeita.`}
        loading={deleteMutation.isPending}
      />
    </PageShell>
  );
};
