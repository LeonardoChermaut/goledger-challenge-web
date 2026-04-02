import { FunctionComponent } from "react";
import { Modal } from "./Modal";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const ConfirmDialog: FunctionComponent<ConfirmDialogProps> = ({
  open,
  title,
  message,
  loading,
  onClose,
  onConfirm,
}) => (
  <Modal open={open} onClose={onClose} title={title}>
    <p className="mb-6 text-muted-foreground">{message}</p>
    <div className="flex justify-end gap-3">
      <button
        onClick={onClose}
        className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
      >
        Cancelar
      </button>
      <button
        onClick={onConfirm}
        disabled={loading}
        className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/80 transition-colors disabled:opacity-50"
      >
        {loading ? "Removendo..." : "Remover"}
      </button>
    </div>
  </Modal>
);
