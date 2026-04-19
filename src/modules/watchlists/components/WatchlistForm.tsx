import { SearchableSelect } from "@/components/SearchableSelect";
import {
  IWatchlistFormData,
  ITvShowData,
} from "@/shared/interfaces/interfaces";
import { FunctionComponent, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

type WatchlistFormProps = {
  initialData?: {
    title: string;
    description: string;
    tvShows: string[];
  };

  isSubmitting: boolean;
  isEditing: boolean;
  tvShows: ITvShowData[] | undefined;

  onCancel: () => void;
  onSubmit: (data: IWatchlistFormData) => void;
};

export const WatchlistForm: FunctionComponent<WatchlistFormProps> = ({
  initialData,
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
  } = useForm<IWatchlistFormData>({
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      tvShows: initialData?.tvShows ?? [],
    },
    mode: "onChange",
  });

  const selectedTvShows = watch("tvShows");

  const filteredModalTvShows = useMemo(
    () =>
      tvShows?.filter((tvShow) =>
        tvShow.title.toLowerCase().includes(searchModalTerm.toLowerCase()),
      ) || [],
    [tvShows, searchModalTerm],
  );

  const toggleShow = (key: string) => {
    const current = selectedTvShows ?? [];
    const next = current.includes(key)
      ? current.filter((itemKey) => itemKey !== key)
      : [...current, key];
    setValue("tvShows", next, { shouldValidate: true });
  };

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <form
      onSubmit={handleFormSubmit}
      className="space-y-4 max-h-[60vh] overflow-y-auto pr-1"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Título
        </label>
        <input
          type="text"
          {...register("title", { required: "Título é obrigatório" })}
          disabled={isEditing}
          className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-destructive">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Descrição
        </label>
        <textarea
          {...register("description")}
          rows={2}
          className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <SearchableSelect
        label="Programas de TV"
        items={filteredModalTvShows}
        searchTerm={searchModalTerm}
        onSearchChange={setSearchModalTerm}
        renderItem={(tvShow) => (
          <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground transition-colors hover:bg-primary/5 p-1 rounded">
            <input
              type="checkbox"
              checked={selectedTvShows?.includes(tvShow["@key"]) ?? false}
              onChange={() => toggleShow(tvShow["@key"])}
              className="rounded border-input accent-primary h-4 w-4"
            />
            {tvShow.title}
          </label>
        )}
      />

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
