import { ITvShowFormData } from "@/shared/interfaces/interfaces";
import { isValidAge } from "@/shared/utils/utils";
import { FunctionComponent } from "react";
import { useForm } from "react-hook-form";

type TvShowFormProps = {
  isEditing: boolean;
  isSubmitting: boolean;
  initialData: ITvShowFormData | null;
  onSubmit: (data: ITvShowFormData) => void;
  onCancel: () => void;
};

export const TvShowForm: FunctionComponent<TvShowFormProps> = ({
  isEditing,
  initialData,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ITvShowFormData>({
    defaultValues: {
      title: initialData?.title ?? "",
      description: initialData?.description ?? "",
      recommendedAge: initialData?.recommendedAge ?? 0,
    },
    mode: "onChange",
  });

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Título
        </label>
        <input
          type="text"
          {...register("title", { required: "Título é obrigatório" })}
          disabled={isEditing}
          className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
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
          {...register("description", { required: "Descrição é obrigatória" })}
          rows={3}
          className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">
          Classificação Etária
        </label>
        <input
          type="number"
          {...register("recommendedAge", {
            required: "Classificação é obrigatória",
            validate: (value) => isValidAge(value) || "Deve ser entre 0 e 18",
          })}
          className="w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {errors.recommendedAge && (
          <p className="mt-1 text-xs text-destructive">
            {errors.recommendedAge.message}
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
