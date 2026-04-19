import { SearchableSelect } from "@/components/SearchableSelect";
import {
  IEpisodeFormData,
  ISeasonData,
  ITvShowData,
} from "@/shared/interfaces/interfaces";
import { isValidRating } from "@/shared/utils/utils";
import { FunctionComponent, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

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

  onSubmit: (data: IEpisodeFormData) => void;

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
  const [searchModalTerm, setSearchModalTerm] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<IEpisodeFormData>({
    defaultValues: {
      season: initialData?.season ?? "",
      episodeNumber: initialData?.episodeNumber
        ? Number(initialData.episodeNumber)
        : undefined,
      title: initialData?.title ?? "",
      releaseDate: initialData?.releaseDate ?? "",
      description: initialData?.description ?? "",
      rating: initialData?.rating ? Number(initialData.rating) : undefined,
    },
    mode: "onChange",
  });

  const selectedSeason = watch("season");

  const filteredModalSeasons = useMemo(
    () =>
      seasons?.filter((season) => {
        const tvShow = tvShows?.find(
          (item) => item["@key"] === season.tvShow["@key"],
        );
        const label = `${tvShow?.title ?? ""} Temporada ${season.number}`;
        return label.toLowerCase().includes(searchModalTerm.toLowerCase());
      }) || [],
    [seasons, tvShows, searchModalTerm],
  );

  const handleFormSubmit = handleSubmit((data) => onSubmit(data));

  return (
    <form
      onSubmit={handleFormSubmit}
      className="space-y-4 max-h-[70vh] overflow-y-auto pr-1"
    >
      <SearchableSelect
        label="Temporada"
        items={filteredModalSeasons}
        searchTerm={searchModalTerm}
        onSearchChange={setSearchModalTerm}
        placeholder="Pesquisar programa ou temporada..."
        renderItem={(season) => {
          const tvShow = tvShows?.find(
            (item) => item["@key"] === season.tvShow["@key"],
          );

          return (
            <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground transition-colors hover:bg-primary/5 p-1 rounded">
              <input
                type="checkbox"
                name="season"
                checked={selectedSeason === season["@key"]}
                onChange={() =>
                  setValue("season", season["@key"], { shouldValidate: true })
                }
                className="rounded-full border-input accent-primary h-4 w-4"
                disabled={isEditing}
              />
              {tvShow?.title ?? "?"} - Temporada {season.number}
            </label>
          );
        }}
      />
      {errors.season && (
        <p className="text-xs text-destructive">{errors.season.message}</p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Número do Episódio
        </label>
        <input
          type="number"
          {...register("episodeNumber", {
            required: "Número é obrigatório",
            valueAsNumber: true,
          })}
          disabled={isEditing}
          className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {errors.episodeNumber && (
          <p className="mt-1 text-xs text-destructive">
            {errors.episodeNumber.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Título
        </label>
        <input
          type="text"
          {...register("title", { required: "Título é obrigatório" })}
          className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-destructive">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Data de Lançamento
        </label>
        <input
          type="date"
          {...register("releaseDate")}
          className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Descrição
        </label>
        <textarea
          {...register("description", { required: "Descrição é obrigatória" })}
          rows={2}
          className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
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
          {...register("rating", {
            validate: (ratingValue) =>
              ratingValue === undefined ||
              ratingValue === null ||
              isValidRating(ratingValue) ||
              "Avaliação inválida (máx 10, ex: 8.5)",
          })}
          className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
        />
        {errors.rating && (
          <p className="mt-1 text-xs text-destructive">
            {errors.rating.message}
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
          disabled={isSubmitting || !isValid}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
};
