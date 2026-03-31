import {
  useCreateAsset,
  useDeleteAsset,
  useSearchAssets,
  useUpdateAsset,
} from "@/hooks/use-assets";
import {
  IEpisodeData,
  ISeasonData,
  ITvShowData,
} from "@/shared/interfaces/interface";
import { Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { DropdownMenu } from "../../components/DropdownMenu";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Modal } from "../../components/Modal";
import { PageShell } from "../../components/PageShell";
import { Pagination } from "../../components/Pagination";
import {
  findAssetByKey,
  formatSeasonLabel,
  isValidRating,
} from "../../shared/utils/utils";

const ITEMS_PER_PAGE = 9;

export const EpisodesPage = () => {
  const {
    data: episodes,
    isLoading,
    error,
  } = useSearchAssets<IEpisodeData>("episodes");
  const { data: seasons } = useSearchAssets<ISeasonData>("seasons");
  const { data: tvShows } = useSearchAssets<ITvShowData>("tvShows");

  const createMutation = useCreateAsset<IEpisodeData>("episodes");
  const updateMutation = useUpdateAsset("episodes");
  const deleteMutation = useDeleteAsset("episodes");

  const [showForm, setShowForm] = useState<boolean>(false);
  const [editItem, setEditItem] = useState<IEpisodeData | null>(null);
  const [deleteItem, setDeleteItem] = useState<IEpisodeData | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [formState, setFormState] = useState({
    season: "",
    episodeNumber: "",
    title: "",
    releaseDate: "",
    description: "",
    rating: "",
    searchModalTerm: "",
  });

  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleChange = (field: keyof typeof formState, value: string) =>
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));

  const getSeasonLabel = (ep: IEpisodeData): string => {
    const season = findAssetByKey(seasons, ep.season["@key"]);

    if (!season) {
      return "Desconhecido";
    }

    const getTvShowTitle = (key: string): string =>
      findAssetByKey(tvShows, key)?.title ?? key;

    return formatSeasonLabel(
      getTvShowTitle(season.tvShow["@key"]),
      season.number,
    );
  };

  const openCreate = () => {
    setFormState({
      season: "",
      episodeNumber: "",
      title: "",
      releaseDate: "",
      description: "",
      rating: "",
      searchModalTerm: "",
    });

    setEditItem(null);
    setShowForm(true);
  };

  const openEdit = (item: IEpisodeData) => {
    setFormState({
      season: item.season["@key"],
      episodeNumber: String(item.episodeNumber),
      title: item.title,
      releaseDate: item.releaseDate ? item.releaseDate.slice(0, 10) : "",
      description: item.description,
      rating: item.rating != null ? String(item.rating) : "",
      searchModalTerm: "",
    });
    setEditItem(item);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    const isNew = !editItem;
    const hasKeyChanged =
      editItem &&
      (formState.season !== editItem.season["@key"] ||
        Number(formState.episodeNumber) !== editItem.episodeNumber);

    if (isNew || hasKeyChanged) {
      if (hasKeyChanged) {
        await deleteMutation.mutateAsync({
          "@assetType": "episodes",
          "@key": editItem["@key"],
        });
      }

      await createMutation.mutateAsync({
        "@assetType": "episodes",
        season: { "@assetType": "seasons", "@key": formState.season },
        episodeNumber: Number(formState.episodeNumber),
        title: formState.title,
        releaseDate: formState.releaseDate
          ? new Date(formState.releaseDate).toISOString()
          : "",
        description: formState.description,
        rating: formState.rating ? Number(formState.rating) : undefined,
      });
    } else {
      await updateMutation.mutateAsync({
        "@assetType": "episodes",
        "@key": editItem["@key"],
        season: { "@assetType": "seasons", "@key": formState.season },
        episodeNumber: Number(formState.episodeNumber),
        title: formState.title,
        releaseDate: formState.releaseDate
          ? new Date(formState.releaseDate).toISOString()
          : undefined,
        description: formState.description,
        rating: formState.rating ? Number(formState.rating) : undefined,
      });
    }

    setShowForm(false);
  };

  const handleDelete = async () => {
    if (!deleteItem) {
      return;
    }

    await deleteMutation.mutateAsync({
      "@assetType": "episodes",
      "@key": deleteItem["@key"],
    });
    setDeleteItem(null);
  };

  const filtered = useMemo(() => {
    return episodes?.filter((e) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [episodes, searchTerm]);

  const totalPages = Math.ceil((filtered?.length || 0) / ITEMS_PER_PAGE);
  const paginatedData = filtered?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const filteredModalSeasons = useMemo(() => {
    return seasons?.filter((s) => {
      const show = tvShows?.find((t) => t["@key"] === s.tvShow["@key"]);
      const label = `${show?.title ?? ""} Temporada ${s.number}`;
      return label
        .toLowerCase()
        .includes(formState.searchModalTerm.toLowerCase());
    });
  }, [seasons, tvShows, formState.searchModalTerm]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const isFormValid =
    !isSubmitting &&
    (editItem || (formState.season && formState.episodeNumber)) &&
    formState.title &&
    formState.description &&
    (!formState.rating || isValidRating(Number(formState.rating)));

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
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full rounded-md border border-input bg-secondary pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message="Falha ao carregar episódios." />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedData?.map((ep) => (
          <div
            key={ep["@key"]}
            className="glass-card p-5 flex flex-col h-full gap-3 group relative transition-all duration-300 hover:shadow-xl hover:z-20"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">
                  {getSeasonLabel(ep)} · E{ep.episodeNumber}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <h3 className="font-heading text-lg font-semibold text-foreground leading-tight">
                    {ep.title}
                  </h3>
                  {ep.rating != null && (
                    <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">
                      <Star className="h-3 w-3 fill-primary" /> {ep.rating}
                    </span>
                  )}
                </div>
              </div>

              <DropdownMenu
                options={[
                  {
                    label: "Editar",
                    icon: <Pencil className="h-3.5 w-3.5" />,
                    onClick: () => openEdit(ep),
                  },
                  {
                    label: "Remover",
                    icon: <Trash2 className="h-3.5 w-3.5" />,
                    onClick: () => setDeleteItem(ep),
                    variant: "destructive",
                  },
                ]}
              />
            </div>

            <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
              {ep.description}
            </p>

            <div className="flex items-center pt-2 mt-auto">
              <span className="text-xs text-muted-foreground/80 font-medium">
                {ep.releaseDate
                  ? new Date(ep.releaseDate).toLocaleDateString()
                  : "Sem data"}
              </span>
            </div>
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
          Nenhum episódio encontrado.
        </p>
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editItem ? "Editar Episódio" : "Novo Episódio"}
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Temporada
            </label>

            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                placeholder="Pesquisar programa ou temporada..."
                value={formState.searchModalTerm}
                onChange={(e) =>
                  handleChange("searchModalTerm", e.target.value)
                }
                className="w-full rounded-md border border-input bg-secondary/50 pl-8 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <select
              value={formState.season}
              onChange={(e) => handleChange("season", e.target.value)}
              className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Selecione uma temporada</option>
              {filteredModalSeasons?.map((s) => {
                const show = tvShows?.find(
                  (t) => t["@key"] === s.tvShow["@key"],
                );
                return (
                  <option key={s["@key"]} value={s["@key"]}>
                    {show?.title ?? "?"} - Temporada {s.number}
                  </option>
                );
              })}

              {filteredModalSeasons?.length === 0 && (
                <option disabled>Nenhum resultado</option>
              )}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              Número do Episódio
            </label>
            <input
              type="number"
              value={formState.episodeNumber}
              onChange={(e) => handleChange("episodeNumber", e.target.value)}
              className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

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
              Data de Lançamento
            </label>
            <input
              type="date"
              value={formState.releaseDate}
              onChange={(e) => handleChange("releaseDate", e.target.value)}
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
              Avaliação (opcional)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={formState.rating}
              onChange={(e) => handleChange("rating", e.target.value)}
              className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {formState.rating && !isValidRating(Number(formState.rating)) && (
              <p className="mt-1 text-xs text-destructive">
                Avaliação inválida (máx 10, ex: 8.5)
              </p>
            )}
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
                !formState.season ||
                !formState.episodeNumber ||
                !formState.title
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
        title="Remover Episódio"
        message={`Deseja remover o Episódio ${deleteItem?.episodeNumber} de "${deleteItem?.title}"? Esta ação não pode ser desfeita.`}
        loading={deleteMutation.isPending}
      />
    </PageShell>
  );
};
