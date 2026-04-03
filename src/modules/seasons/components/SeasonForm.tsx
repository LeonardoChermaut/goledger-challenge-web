import { SearchableSelect } from "@/components/SearchableSelect";
import { ITvShowData } from "@/shared/interfaces/interfaces";
import { FormEvent, FunctionComponent, useMemo, useState } from "react";

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
  onSubmit: (data: { tvShow: string; number: number; year: number }) => void;
};

export const SeasonForm: FunctionComponent<SeasonFormProps> = ({
  tvShows,
  initialData,
  isSubmitting,
  isEditing,
  onSubmit,
  onCancel,
}) => {
  const [formState, setFormState] = useState({
    searchModalTerm: "",
    tvShow: initialData?.tvShow || "",
    year: initialData?.year ? String(initialData.year) : "",
    number: initialData?.number ? String(initialData.number) : "",
  });

  const handleChange = (field: keyof typeof formState, value: string) =>
    setFormState((prev) => ({ ...prev, [field]: value }));

  const filteredModalTvShows = useMemo(
    () =>
      tvShows?.filter((s) =>
        s.title.toLowerCase().includes(formState.searchModalTerm.toLowerCase()),
      ) || [],
    [tvShows, formState.searchModalTerm],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      tvShow: formState.tvShow,
      number: Number(formState.number),
      year: Number(formState.year),
    });
  };

  const isValid = formState.tvShow && formState.number && formState.year;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[70vh] overflow-y-auto pr-1"
    >
      <SearchableSelect
        label="Programa de TV"
        items={filteredModalTvShows}
        searchTerm={formState.searchModalTerm}
        onSearchChange={(val) => handleChange("searchModalTerm", val)}
        renderItem={(s) => (
          <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground transition-colors hover:bg-primary/5 p-1 rounded">
            <input
              type="checkbox"
              name="tvShow"
              checked={formState.tvShow === s["@key"]}
              onChange={() => handleChange("tvShow", s["@key"])}
              className="rounded-full border-input accent-primary h-4 w-4"
              disabled={isEditing}
            />
            {s.title}
          </label>
        )}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Número da Temporada
        </label>
        <input
          type="number"
          value={formState.number}
          onChange={(e) => handleChange("number", e.target.value)}
          required
          disabled={isEditing}
          className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
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
          required
          className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
        />
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
