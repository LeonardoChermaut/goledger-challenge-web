export const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">
          Página não encontrada.
        </p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Voltar para o Início
        </a>
      </div>
    </div>
  );
};
