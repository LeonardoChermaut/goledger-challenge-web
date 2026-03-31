import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ITvShowData } from "../../../shared/interfaces/interface";

interface WatchlistFormProps {
  initialData?: {
    title: string;
    description: string;
    tvShows: string[];
  };
  tvShows: ITvShowData[] | undefined;
  onSubmit: (data: { title: string; description: string; tvShows: string[] }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const WatchlistForm = ({
  initialData,
  tvShows,
  onSubmit,
  onCancel,
  isSubmitting,
}: WatchlistFormProps) => {
  const [formState, setFormState] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    tvShows: initialData?.tvShows || [],
    searchModalTerm: "",
  });

  const handleChange = (field: keyof typeof formState, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const filteredModalTvShows = useMemo(() => {
    return (
      tvShows?.filter((s) =>
        s.title.toLowerCase().includes(formState.searchModalTerm.toLowerCase())
      ) || []
    );
  }, [tvShows, formState.searchModalTerm]);

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
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Título
        </label>
        <input
          type="text"
          value={formState.title}
          onChange={(e) => handleChange("title", e.target.value)}
          required
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
            onChange={(e) => handleChange("searchModalTerm", e.target.value)}
            className="w-full rounded-md border border-input bg-secondary/50 pl-8 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="space-y-2 max-h-40 overflow-y-auto rounded-md border border-input bg-secondary p-3">
          {filteredModalTvShows.map((s) => (
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

          {filteredModalTvShows.length === 0 && (
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
