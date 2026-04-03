import { FunctionComponent, ReactNode } from "react";
import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";

type QueryResultProps = {
  error: Error;
  empty: boolean;
  loading: boolean;
  children: ReactNode;
  emptyMessage?: string;
  loadingClassName?: string;
};

export const QueryResult: FunctionComponent<QueryResultProps> = ({
  loading,
  error,
  empty,
  emptyMessage = "Nenhum item encontrado.",
  children,
  loadingClassName,
}) => {
  if (loading) {
    return (
      <div
        className={`flex flex-col items-center justify-center py-20 ${loadingClassName ?? ""}`}
      >
        <div className="relative">
          <Loader2 className="h-10 w-10 animate-spin text-primary/60" />
          <div className="absolute inset-0 h-10 w-10 animate-ping rounded-full bg-primary/10" />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card flex flex-col items-center justify-center py-16">
        <div className="mb-4 rounded-full bg-destructive/10 p-3">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <p className="text-sm font-medium text-foreground">
          Ops! Algo deu errado
        </p>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Erro ao carregar dados. Tente novamente mais tarde.
        </p>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="glass-card flex flex-col items-center justify-center py-16">
        <div className="mb-4 rounded-full bg-primary/10 p-3">
          <Inbox className="h-8 w-8 text-primary/60" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
