import { Search } from "lucide-react";
import { FunctionComponent, useMemo, useState } from "react";
import { ITvShowData } from "../../../shared/interfaces/interface";

type SeasonFormProps = {
  initialData?: {
    tvShow: string;
    number: number | string;
    year: number | string;
  };
  tvShows: ITvShowData[] | undefined;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (data: { tvShow: string; number: number; year: number }) => void;
};

export const SeasonForm: FunctionComponent<SeasonFormProps> = ({
  initialData,
  tvShows,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [formState, setFormState] = useState({
    tvShow: initialData?.tvShow || "",
    number: initialData?.number ? String(initialData.number) : "",
    year: initialData?.year ? String(initialData.year) : "",
    searchModalTerm: "",
  });

  const handleChange = (field: keyof typeof formState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const filteredModalTvShows = useMemo(() => {
    return (
      tvShows?.filter((s) =>
        s.title.toLowerCase().includes(formState.searchModalTerm.toLowerCase()),
      ) || []
    );
  }, [tvShows, formState.searchModalTerm]);

  const handleSubmit = (e: React.FormEvent) => {
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
            onChange={(e) => handleChange("searchModalTerm", e.target.value)}
            className="w-full rounded-md border border-input bg-secondary/50 pl-8 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <select
          value={formState.tvShow}
          onChange={(e) => handleChange("tvShow", e.target.value)}
          required
          className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        >
          <option value="">Selecione um programa</option>
          {filteredModalTvShows.map((s) => (
            <option key={s["@key"]} value={s["@key"]}>
              {s.title}
            </option>
          ))}
          {filteredModalTvShows.length === 0 && (
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
          required
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
          required
          className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
