import { SearchableSelect } from "@/components/SearchableSelect";
import { ISeasonData, ITvShowData } from "@/shared/interfaces/interface";
import { isValidRating } from "@/shared/utils/utils";
import { FormEvent, FunctionComponent, useMemo, useState } from "react";

type EpisodeFormProps = {
  initialData?: {
    season: string;
    episodeNumber: number | string;
    title: string;
    releaseDate: string;
    description: string;
    rating: string;
  };

  isSubmitting: boolean;
  isEditing: boolean;
  seasons: ISeasonData[] | undefined;
  tvShows: ITvShowData[] | undefined;

  onSubmit: (data: {
    season: string;
    episodeNumber: number;
    title: string;
    releaseDate: string;
    description: string;
    rating?: number;
  }) => void;

  onCancel: () => void;
};

export const EpisodeForm: FunctionComponent<EpisodeFormProps> = ({
  initialData,
  seasons,
  tvShows,
  onSubmit,
  onCancel,
  isSubmitting,
  isEditing,
}) => {
  const [formState, setFormState] = useState({
    searchModalTerm: "",
    title: initialData?.title || "",
    season: initialData?.season || "",
    releaseDate: initialData?.releaseDate || "",
    description: initialData?.description || "",

    episodeNumber: initialData?.episodeNumber
      ? String(initialData.episodeNumber)
      : "",

    rating: initialData?.rating != null ? String(initialData.rating) : "",
  });

  const handleChange = (field: keyof typeof formState, value: string) =>
    setFormState((prev) => ({ ...prev, [field]: value }));

  const filteredModalSeasons = useMemo(
    () =>
      seasons?.filter((s) => {
        const show = tvShows?.find((t) => t["@key"] === s.tvShow["@key"]);
        const label = `${show?.title ?? ""} Temporada ${s.number}`;
        return label
          .toLowerCase()
          .includes(formState.searchModalTerm.toLowerCase());
      }) || [],
    [seasons, tvShows, formState.searchModalTerm],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      season: formState.season,
      episodeNumber: Number(formState.episodeNumber),
      title: formState.title,
      releaseDate: formState.releaseDate,
      description: formState.description,
      rating: formState.rating ? Number(formState.rating) : undefined,
    });
  };

  const isFormValid =
    formState.season &&
    formState.episodeNumber &&
    formState.title &&
    formState.description &&
    (!formState.rating || isValidRating(Number(formState.rating)));

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[70vh] overflow-y-auto pr-1"
    >
      <SearchableSelect
        label="Temporada"
        items={filteredModalSeasons}
        searchTerm={formState.searchModalTerm}
        onSearchChange={(val) => handleChange("searchModalTerm", val)}
        placeholder="Pesquisar programa ou temporada..."
        renderItem={(s) => {
          const show = tvShows?.find((t) => t["@key"] === s.tvShow["@key"]);

          return (
            <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground transition-colors hover:bg-primary/5 p-1 rounded">
              <input
                type="checkbox"
                name="season"
                checked={formState.season === s["@key"]}
                onChange={() => handleChange("season", s["@key"])}
                className="rounded-full border-input accent-primary h-4 w-4"
                disabled={isEditing}
              />
              {show?.title ?? "?"} - Temporada {s.number}
            </label>
          );
        }}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Número do Episódio
        </label>
        <input
          type="number"
          value={formState.episodeNumber}
          onChange={(e) => handleChange("episodeNumber", e.target.value)}
          required
          disabled={isEditing}
          className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
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
          required
          className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
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
          className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
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
          required
          className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
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
          className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
        />
        {formState.rating && !isValidRating(Number(formState.rating)) && (
          <p className="mt-1 text-xs text-destructive">
            Avaliação inválida (máx 10, ex: 8.5)
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
};
