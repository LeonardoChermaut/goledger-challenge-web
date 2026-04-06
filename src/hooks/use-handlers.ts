import { useCallback, useState } from "react";
import { useDisclosure } from "./use-disclosure";

interface IDisclosure {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

interface IUseHandlers<TDisplay> {
  editItem: TDisplay | null;
  deleteItem: TDisplay | null;

  formDisclosure: IDisclosure;
  deleteDisclosure: IDisclosure;

  openCreate: () => void;
  openEdit: (item: TDisplay) => void;
  openDelete: (item: TDisplay) => void;
}

export const useHandlers = <TDisplay>(): IUseHandlers<TDisplay> => {
  const [editItem, setEditItem] = useState<TDisplay | null>(null);
  const [deleteItem, setDeleteItem] = useState<TDisplay | null>(null);

  const formDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();

  const openCreate = useCallback(() => {
    setEditItem(null);
    formDisclosure.open();
  }, [formDisclosure]);

  const openEdit = useCallback(
    (item: TDisplay) => {
      setEditItem(item);
      formDisclosure.open();
    },
    [formDisclosure],
  );

  const openDelete = useCallback(
    (item: TDisplay) => {
      setDeleteItem(item);
      deleteDisclosure.open();
    },
    [deleteDisclosure],
  );

  const closeForm = useCallback(() => {
    formDisclosure.close();
    setEditItem(null);
  }, [formDisclosure]);

  const closeDelete = useCallback(() => {
    deleteDisclosure.close();
    setDeleteItem(null);
  }, [deleteDisclosure]);

  return {
    editItem,
    deleteItem,
    formDisclosure: { ...formDisclosure, close: closeForm },
    deleteDisclosure: { ...deleteDisclosure, close: closeDelete },
    openCreate,
    openEdit,
    openDelete,
  };
};
