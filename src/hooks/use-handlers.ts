import { useState } from "react";
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

  const openCreate = () => {
    setEditItem(null);
    formDisclosure.open();
  };

  const openEdit = (item: TDisplay) => {
    setEditItem(item);
    formDisclosure.open();
  };

  const openDelete = (item: TDisplay) => {
    setDeleteItem(item);
    deleteDisclosure.open();
  };

  const closeForm = () => {
    formDisclosure.close();
    setEditItem(null);
  };

  const closeDelete = () => {
    deleteDisclosure.close();
    setDeleteItem(null);
  };

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
