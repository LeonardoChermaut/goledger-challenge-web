import { SearchableSelect } from "@/components/SearchableSelect";
import { ITvShowData } from "@/shared/interfaces/interface";
import { FunctionComponent, useMemo, useState } from "react";

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
  onSubmit: (data: {
    title: string;
    description: string;
    tvShows: string[];
  }) => void;
};

export const WatchlistForm: FunctionComponent<WatchlistFormProps> = ({
  initialData,
  tvShows,
  onSubmit,
  onCancel,
  isSubmitting,
  isEditing,
}) => {
  const [formState, setFormState] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    tvShows: initialData?.tvShows || [],
    searchModalTerm: "",
  });

  const handleChange = (field: keyof typeof formState, value: unknown) =>
    setFormState((prev) => ({ ...prev, [field]: value }));

  const filteredModalTvShows = useMemo(
    () =>
      tvShows?.filter((tvShow) =>
        tvShow.title
          .toLowerCase()
          .includes(formState.searchModalTerm.toLowerCase()),
      ) || [],
    [tvShows, formState.searchModalTerm],
  ) as ITvShowData[];

  const toggleShow = (key: string) => {
    const current = formState.tvShows;

    const next = current.includes(key)
      ? current.filter((k) => k !== key)
      : [...current, key];

    handleChange("tvShows", next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formState.title,
      description: formState.description,
      tvShows: formState.tvShows,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[60vh] overflow-y-auto pr-1"
    >
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Título
        </label>
        <input
          type="text"
          value={formState.title}
          onChange={(e) => handleChange("title", e.target.value)}
          required
          disabled={isEditing}
          className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset disabled:opacity-50 disabled:cursor-not-allowed"
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

      <SearchableSelect
        label="Programas de TV"
        items={filteredModalTvShows}
        searchTerm={formState.searchModalTerm}
        onSearchChange={(value) => handleChange("searchModalTerm", value)}
        renderItem={(tvShow) => (
          <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground transition-colors hover:bg-primary/5 p-1 rounded">
            <input
              type="checkbox"
              checked={formState.tvShows.includes(tvShow["@key"])}
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
          disabled={isSubmitting || !formState.title}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
};
