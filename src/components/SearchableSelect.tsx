import { Search } from "lucide-react";
import { ReactNode } from "react";

type SearchableSelectProps<T> = {
  label: string;
  items: T[] | undefined;
  searchTerm: string;
  emptyMessage?: string;
  placeholder?: string;
  maxHeight?: string;
  renderItem: (item: T) => ReactNode;
  onSearchChange: (value: string) => void;
};

export const SearchableSelect = <T extends Record<string, any>>({
  label,
  items,
  searchTerm,
  onSearchChange,
  renderItem,
  emptyMessage = "Nenhum resultado correspondente.",
  placeholder = "Pesquisar...",
  maxHeight = "max-h-40",
}: SearchableSelectProps<T>) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative mb-2">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-md border border-input bg-secondary/50 pl-8 pr-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:ring-inset"
        />
      </div>

      <div
        className={`space-y-1 overflow-y-auto rounded-md border border-input bg-secondary p-2 ${maxHeight}`}
      >
        {items?.map((item) => (
          <div key={item["@key"] || Math.random()}>{renderItem(item)}</div>
        ))}

        {items?.length === 0 && (
          <p className="text-xs text-muted-foreground p-1">{emptyMessage}</p>
        )}

        {!items && (
          <p className="text-xs text-muted-foreground p-1">
            Carregando itens...
          </p>
        )}
      </div>
    </div>
  );
};
