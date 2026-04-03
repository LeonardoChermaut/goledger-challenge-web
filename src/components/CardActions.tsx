import { DropdownMenu } from "@/components/DropdownMenu";
import { Pencil, Trash2 } from "lucide-react";
import { FunctionComponent } from "react";

type CardActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export const CardActions: FunctionComponent<CardActionsProps> = ({
  onEdit,
  onDelete,
}) => (
  <DropdownMenu
    options={[
      {
        label: "Editar",
        icon: <Pencil className="h-3.5 w-3.5" />,
        onClick: onEdit,
      },
      {
        label: "Remover",
        icon: <Trash2 className="h-3.5 w-3.5" />,
        onClick: onDelete,
        variant: "destructive",
      },
    ]}
  />
);
