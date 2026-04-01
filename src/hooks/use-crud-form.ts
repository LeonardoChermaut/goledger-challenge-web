import { routes } from "@/shared/routes/routes";
import { api } from "@/shared/services/service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ICrudFormOptions<T extends object> {
  assetType: string;
  keyFields: (keyof T)[];
}

export const useCrudForm = <T extends object>({
  assetType,
  keyFields,
}: ICrudFormOptions<T>) => {
  const queryClient = useQueryClient();

  const checkKeyChanged = (original: T | null, updated: T): boolean => {
    if (!original) return false;
    return keyFields.some((field) => original[field] !== updated[field]);
  };

  const invalidateAndNotify = (message: string) => {
    queryClient.invalidateQueries({ queryKey: ["assets", assetType] });
    toast.success(message);
  };

  const handleCreate = useMutation({
    mutationFn: (data: T) =>
      api.post(routes.api.methods.createAsset, {
        asset: [{ "@assetType": assetType, ...data }],
      }),
    onSuccess: () => invalidateAndNotify("Criado com sucesso!"),
    onError: () => toast.error("Erro ao criar."),
  });

  const handleUpdate = useMutation({
    mutationFn: (data: T & { "@key": string }) =>
      api.put(routes.api.methods.updateAsset, {
        update: { "@assetType": assetType, ...data },
      }),
    onSuccess: () => invalidateAndNotify("Atualizado com sucesso!"),
    onError: () => toast.error("Erro ao atualizar."),
  });

  const handleDelete = useMutation({
    mutationFn: (key: string) =>
      api.delete(routes.api.methods.deleteAsset, {
        key: { "@assetType": assetType, "@key": key },
      }),
    onSuccess: () => invalidateAndNotify("Removido com sucesso!"),
    onError: () =>
      toast.error(
        "Não foi possível remover. Verifique se não há nenhum item vinculado a este.",
      ),
  });

  const handleEdit = useMutation({
    mutationFn: async ({ oldKey, newData }: { oldKey: string; newData: T }) => {
      await api.delete(routes.api.methods.deleteAsset, {
        key: { "@assetType": assetType, "@key": oldKey },
      });
      await api.post(routes.api.methods.createAsset, {
        asset: [{ "@assetType": assetType, ...newData }],
      });
    },
    onSuccess: () => invalidateAndNotify("Atualizado com sucesso!"),
    onError: () => toast.error("Erro ao atualizar."),
  });

  const submit = async (originalItem: T | null, formData: T) => {
    if (!originalItem) {
      return handleCreate.mutateAsync(formData);
    }

    if (checkKeyChanged(originalItem, formData)) {
      return handleEdit.mutateAsync({
        oldKey: (originalItem as T & { "@key": string })["@key"],
        newData: formData,
      });
    }

    return handleUpdate.mutateAsync({
      "@key": (originalItem as T & { "@key": string })["@key"],
      ...formData,
    } as T & { "@key": string });
  };

  return {
    submit,
    isSubmitting:
      handleCreate.isPending || handleUpdate.isPending || handleEdit.isPending,
    delete: handleDelete,
  };
};
