import { FunctionComponent, ReactNode } from "react";
import { ErrorMessage } from "./ErrorMessage";
import { LoadingSpinner } from "./LoadingSpinner";

type QueryResultProps = {
  loading: boolean;
  error: any;
  empty: boolean;
  emptyMessage?: string;
  children: ReactNode;
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
      <div className={loadingClassName}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage message="Erro ao carregar dados. Tente novamente mais tarde." />
    );
  }

  if (empty) {
    return (
      <p className="text-center py-12 text-muted-foreground">{emptyMessage}</p>
    );
  }

  return <>{children}</>;
};
