import {
  useCreateAsset,
  useDeleteAsset,
  useSearchAssets,
  useUpdateAsset,
} from "@/hooks/use-assets";
import { Pencil, Plus, Search, Trash2, Tv } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { DropdownMenu } from "../../components/DropdownMenu";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Modal } from "../../components/Modal";
import { PageShell } from "../../components/PageShell";
import { Pagination } from "../../components/Pagination";
import { ITvShowData, IWatchlistData } from "../../shared/interfaces/interface";
import { findAssetByKey } from "../../shared/utils/utils";

const ITEMS_PER_PAGE = 9;

export const WatchlistsPage = () => {
  const {
    data: watchlists,
    isLoading,
    error,
  } = useSearchAssets<IWatchlistData>("watchlist");
  const { data: tvShows } = useSearchAssets<ITvShowData>("tvShows");
  const createMutation = useCreateAsset<IWatchlistData>("watchlist");
  const updateMutation = useUpdateAsset("watchlist");
  const deleteMutation = useDeleteAsset("watchlist");

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<IWatchlistData | null>(null);
  const [deleteItem, setDeleteItem] = useState<IWatchlistData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formState, setFormState] = useState({
    title: "",
    description: "",
    searchModalTerm: "",
    tvShows: [] as string[],
  });

  const [currentPage, setCurrentPage] = useState(1);

  const handleChange = (field: keyof typeof formState, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getTvShowTitle = (key: string): string =>
    findAssetByKey(tvShows, key)?.title ?? key;

  const openCreate = () => {
    setFormState({
      title: "",
      description: "",
      tvShows: [],
      searchModalTerm: "",
    });
    setEditItem(null);
    setShowForm(true);
  };

  const openEdit = (item: IWatchlistData) => {
    setFormState({
      title: item.title,
      description: item.description ?? "",
      tvShows: item.tvShows?.map((s) => s["@key"]) ?? [],
      searchModalTerm: "",
    });
    setEditItem(item);
    setShowForm(true);
  };

  const toggleShow = (key: string) => {
    const current = formState.tvShows;
    const next = current.includes(key)
      ? current.filter((k) => k !== key)
      : [...current, key];
    handleChange("tvShows", next);
  };

  const handleSubmit = async () => {
    const showsPayload = formState.tvShows.map((key) => ({
      "@assetType": "tvShows" as const,
      "@key": key,
    }));

    const isNew = !editItem;
    const hasKeyChanged = editItem && formState.title !== editItem.title;

    if (isNew || hasKeyChanged) {
      if (hasKeyChanged) {
        await deleteMutation.mutateAsync({
          "@assetType": "watchlist",
          "@key": editItem["@key"],
        });
      }

      await createMutation.mutateAsync({
        "@assetType": "watchlist",
        title: formState.title,
        description: formState.description,
        tvShows: showsPayload,
      });
    } else {
      await updateMutation.mutateAsync({
        "@assetType": "watchlist",
        "@key": editItem["@key"],
        description: formState.description,
        tvShows: showsPayload,
      });
    }

    setShowForm(false);
  };

  const handleDelete = async () => {
    if (!deleteItem) {
      return;
    }

    await deleteMutation.mutateAsync({
      "@assetType": "watchlist",
      "@key": deleteItem["@key"],
    });
    setDeleteItem(null);
  };

  const filtered = useMemo(() => {
    return watchlists?.filter((w) =>
      w.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [watchlists, searchTerm]);

  const totalPages = Math.ceil((filtered?.length || 0) / ITEMS_PER_PAGE);
  const paginatedData = filtered?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const filteredModalTvShows = useMemo(() => {
    return tvShows?.filter((s) =>
      s.title.toLowerCase().includes(formState.searchModalTerm.toLowerCase()),
    );
  }, [tvShows, formState.searchModalTerm]);

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
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full rounded-md border border-input bg-secondary pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="Falha ao carregar listas." />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedData?.map((wl) => (
          <div
            key={wl["@key"]}
            className="glass-card p-5 flex flex-col h-full gap-3 group relative hover:z-20"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-heading text-lg font-semibold text-foreground leading-snug flex-1 truncate">
                {wl.title}
              </h3>

              <DropdownMenu
                options={[
                  {
                    label: "Editar",
                    icon: <Pencil className="h-3.5 w-3.5" />,
                    onClick: () => openEdit(wl),
                  },
                  {
                    label: "Remover",
                    icon: <Trash2 className="h-3.5 w-3.5" />,
                    onClick: () => setDeleteItem(wl),
                    variant: "destructive",
                  },
                ]}
              />
            </div>

            {wl.description && (
              <p className="text-sm text-muted-foreground line-clamp-4 font-medium leading-relaxed bg-secondary/20 p-3 rounded-md border border-border/10 italic">
                "{wl.description}"
              </p>
            )}

            {wl.tvShows && wl.tvShows.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1 mt-auto">
                {wl.tvShows.map((s) => (
                  <span
                    key={s["@key"]}
                    title={getTvShowTitle(s["@key"])}
                    className="flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary border border-primary/20 max-w-[140px] transition-all hover:bg-primary/20 cursor-default"
                  >
                    <Tv className="h-3 w-3 shrink-0" />
                    <span className="truncate">
                      {getTvShowTitle(s["@key"])}
                    </span>
                  </span>
                ))}
              </div>
            )}
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
          Nenhuma lista encontrada.
        </p>
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={
          editItem ? "Editar Lista de Favoritos" : "Nova Lista de Favoritos"
        }
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
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
              rows={2}
              className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Programas de TV
            </label>
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Pesquisar programa..."
                value={formState.searchModalTerm}
                onChange={(e) =>
                  handleChange("searchModalTerm", e.target.value)
                }
                className="w-full rounded-md border border-input bg-secondary/50 pl-8 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto rounded-md border border-input bg-secondary p-3">
              {filteredModalTvShows?.map((s) => (
                <label
                  key={s["@key"]}
                  className="flex items-center gap-2 cursor-pointer text-sm text-foreground transition-colors hover:bg-primary/5 p-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={formState.tvShows.includes(s["@key"])}
                    onChange={() => toggleShow(s["@key"])}
                    className="rounded border-input accent-primary h-4 w-4"
                  />
                  {s.title}
                </label>
              ))}

              {filteredModalTvShows?.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Nenhum programa correspondente.
                </p>
              )}

              {(!tvShows || tvShows.length === 0) && (
                <p className="text-xs text-muted-foreground">
                  Nenhum programa de TV disponível.
                </p>
              )}
            </div>
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
              disabled={isSubmitting || !formState.title}
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
        title="Remover Lista de Favoritos"
        message={`Deseja remover "${deleteItem?.title}"? Esta ação não pode ser desfeita.`}
        loading={deleteMutation.isPending}
      />
    </PageShell>
  );
};
