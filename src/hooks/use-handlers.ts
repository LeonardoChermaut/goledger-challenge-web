import { useState } from "react";
import { useDisclosure } from "./use-disclosure";

export const useHandlers = <T>() => {
  const [editItem, setEditItem] = useState<T | null>(null);
  const [deleteItem, setDeleteItem] = useState<T | null>(null);

  const formDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();

  const openCreate = () => {
    setEditItem(null);
    formDisclosure.open();
  };

  const openEdit = (item: T) => {
    setEditItem(item);
    formDisclosure.open();
  };

  const openDelete = (item: T) => {
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
