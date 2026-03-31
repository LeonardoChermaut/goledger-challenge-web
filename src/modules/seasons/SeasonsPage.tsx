import {
  useCreateAsset,
  useDeleteAsset,
  useSearchAssets,
  useUpdateAsset,
} from "@/hooks/useAssets";
import { ISeasonData, ITvShowData } from "@/shared/interfaces/interface";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { DropdownMenu } from "../../components/DropdownMenu";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Modal } from "../../components/Modal";
import { PageShell } from "../../components/PageShell";
import { Pagination } from "../../components/Pagination";
import { findAssetByKey } from "../../shared/utils/utils";

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

  const [showForm, setShowForm] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<ISeasonData | null>(null);
  const [deleteItem, setDeleteItem] = useState<ISeasonData | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [formState, setFormState] = useState({
    tvShow: "",
    number: "",
    year: "",
    searchModalTerm: "",
  });

  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleChange = (field: keyof typeof formState, value: string) =>
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));

  const openCreate = () => {
    setFormState({
      tvShow: "",
      number: "",
      year: "",
      searchModalTerm: "",
    });
    setEditItem(null);
    setShowForm(true);
  };

  const openEdit = (item: ISeasonData) => {
    setFormState({
      tvShow: item.tvShow["@key"],
      number: String(item.number),
      year: String(item.year),
      searchModalTerm: "",
    });
    setEditItem(item);
    setShowForm(true);
  };

  const getTvShowTitle = (season: ISeasonData): string =>
    (season && findAssetByKey(tvShows, season.tvShow["@key"])?.title) ||
    season?.tvShow["@key"];

  const handleSubmit = async () => {
    const isNew = !editItem;
    const hasKeyChanged =
      editItem &&
      (formState.tvShow !== editItem.tvShow["@key"] ||
        Number(formState.number) !== editItem.number);

    if (isNew || hasKeyChanged) {
      if (hasKeyChanged) {
        await deleteMutation.mutateAsync({
          "@assetType": "seasons",
          "@key": editItem["@key"],
        });
      }

      await createMutation.mutateAsync({
        "@assetType": "seasons",
        tvShow: { "@assetType": "tvShows", "@key": formState.tvShow },
        number: Number(formState.number),
        year: Number(formState.year),
      });
    } else {
      await updateMutation.mutateAsync({
        "@assetType": "seasons",
        "@key": editItem["@key"],
        tvShow: { "@assetType": "tvShows", "@key": formState.tvShow },
        number: Number(formState.number),
        year: Number(formState.year),
      });
    }

    setShowForm(false);
  };

  const handleDelete = async () => {
    if (!deleteItem) {
      return;
    }

    await deleteMutation.mutateAsync({
      "@assetType": "seasons",
      "@key": deleteItem["@key"],
    });

    setDeleteItem(null);
  };

  const filtered = useMemo(
    () =>
      seasons?.filter((s) =>
        getTvShowTitle(s).toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [seasons, tvShows, searchTerm],
  );

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
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full rounded-md border border-input bg-secondary pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="Falha ao carregar temporadas." />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedData?.map((season) => (
          <div
            key={season["@key"]}
            className="glass-card p-5 flex flex-col h-full gap-2 group relative hover:z-20"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">
                  {getTvShowTitle(season)}
                </p>
                <h3 className="font-heading text-lg font-semibold text-foreground leading-snug">
                  Temporada {season.number}
                </h3>
              </div>

              <DropdownMenu
                options={[
                  {
                    label: "Editar",
                    icon: <Pencil className="h-3.5 w-3.5" />,
                    onClick: () => openEdit(season),
                  },
                  {
                    label: "Remover",
                    icon: <Trash2 className="h-3.5 w-3.5" />,
                    onClick: () => setDeleteItem(season),
                    variant: "destructive",
                  },
                ]}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-auto">
              Ano: {season.year}
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
          Nenhuma temporada encontrada.
        </p>
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editItem ? "Editar Temporada" : "Nova Temporada"}
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Programa de TV
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

            <select
              value={formState.tvShow}
              onChange={(e) => handleChange("tvShow", e.target.value)}
              className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Selecione um programa</option>
              {filteredModalTvShows?.map((s) => (
                <option key={s["@key"]} value={s["@key"]}>
                  {s.title}
                </option>
              ))}

              {filteredModalTvShows?.length === 0 && (
                <option disabled>Nenhum resultado</option>
              )}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Número da Temporada
            </label>
            <input
              type="number"
              value={formState.number}
              onChange={(e) => handleChange("number", e.target.value)}
              className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Ano de Lançamento
            </label>
            <input
              type="number"
              value={formState.year}
              onChange={(e) => handleChange("year", e.target.value)}
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
                !formState.tvShow ||
                !formState.number ||
                !formState.year
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
        title="Remover Temporada"
        message={`Deseja remover a Temporada ${deleteItem?.number} de ${getTvShowTitle(deleteItem)}? Esta ação não pode ser desfeita.`}
        loading={deleteMutation.isPending}
      />
    </PageShell>
  );
};
