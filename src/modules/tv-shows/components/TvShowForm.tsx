import { FunctionComponent, useState } from "react";
import { ITvShowData } from "../../../shared/interfaces/interface";

type TvShowFormProps = {
  initialData: ITvShowData | null;
  onSubmit: (data: {
    title: string;
    description: string;
    recommendedAge: number;
  }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
};

export const TvShowForm: FunctionComponent<TvShowFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [formState, setFormState] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    recommendedAge:
      initialData?.recommendedAge != null
        ? String(initialData.recommendedAge)
        : "",
  });

  const handleChange = (field: keyof typeof formState, value: string) =>
    setFormState((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: formState.title,
      description: formState.description,
      recommendedAge: Number(formState.recommendedAge),
    });
  };

  const isValid =
    formState.title.trim() &&
    formState.description.trim() &&
    formState.recommendedAge.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          rows={3}
          required
          className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Classificação Etária
        </label>
        <input
          type="number"
          value={formState.recommendedAge}
          onChange={(e) => handleChange("recommendedAge", e.target.value)}
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
