import { SearchableSelect } from "@/components/SearchableSelect";
import { ISeasonFormData, ITvShowData } from "@/shared/interfaces/interfaces";
import { FunctionComponent, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

type SeasonFormProps = {
  initialData?: {
    tvShow: string;
    number: number | string;
    year: number | string;
  };

  isSubmitting: boolean;
  isEditing: boolean;
  tvShows: ITvShowData[] | undefined;

  onCancel: () => void;
  onSubmit: (data: ISeasonFormData) => void;
};

export const SeasonForm: FunctionComponent<SeasonFormProps> = ({
  tvShows,
  initialData,
  isSubmitting,
  isEditing,
  onSubmit,
  onCancel,
}) => {
  const [searchModalTerm, setSearchModalTerm] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<ISeasonFormData>({
    defaultValues: {
      tvShow: initialData?.tvShow ?? "",
      number: initialData?.number ? Number(initialData.number) : undefined,
      year: initialData?.year ? Number(initialData.year) : undefined,
    },
    mode: "onChange",
  });

  const selectedTvShow = watch("tvShow");

  const filteredModalTvShows = useMemo(
    () =>
      tvShows?.filter((show) =>
        show.title.toLowerCase().includes(searchModalTerm.toLowerCase()),
      ) || [],
    [tvShows, searchModalTerm],
  );

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <form
      onSubmit={handleFormSubmit}
      className="space-y-4 max-h-[70vh] overflow-y-auto pr-1"
    >
      <SearchableSelect
        label="Programa de TV"
        items={filteredModalTvShows}
        searchTerm={searchModalTerm}
        onSearchChange={setSearchModalTerm}
        renderItem={(show) => (
          <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground transition-colors hover:bg-primary/5 p-1 rounded">
            <input
              type="checkbox"
              name="tvShow"
              checked={selectedTvShow === show["@key"]}
              onChange={() =>
                setValue("tvShow", show["@key"], { shouldValidate: true })
              }
              className="rounded-full border-input accent-primary h-4 w-4"
              disabled={isEditing}
            />
            {show.title}
          </label>
        )}
      />
      {errors.tvShow && (
        <p className="text-xs text-destructive">{errors.tvShow.message}</p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Número da Temporada
        </label>
        <input
          type="number"
          {...register("number", {
            required: "Número é obrigatório",
            valueAsNumber: true,
          })}
          disabled={isEditing}
          className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {errors.number && (
          <p className="mt-1 text-xs text-destructive">
            {errors.number.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Ano de Lançamento
        </label>
        <input
          type="number"
          {...register("year", {
            required: "Ano é obrigatório",
            valueAsNumber: true,
          })}
          className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
        />
        {errors.year && (
          <p className="mt-1 text-xs text-destructive">{errors.year.message}</p>
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
