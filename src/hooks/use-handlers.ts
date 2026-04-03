import { useState } from "react";
import { useDisclosure } from "./use-disclosure";

// eslint-disable-nextline @typescript-eslint/no-unused-vars
export const useHandlers = <TDisplay, _TPayload = TDisplay>() => {
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
  } as const;
};
