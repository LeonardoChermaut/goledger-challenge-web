import { Search } from "lucide-react";
import { FunctionComponent } from "react";

type SearchInputProps = {
  value: string;
  className?: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export const SearchInput: FunctionComponent<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Pesquisar...",
  className = "",
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-input bg-secondary pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
      />
    </div>
  );
};
