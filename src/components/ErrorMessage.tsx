import { AlertCircle } from "lucide-react";

type ErrorMessageProps = {
  message: string;
};

export const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive">
    <AlertCircle className="h-5 w-5 shrink-0" />
    <p className="text-sm">{message}</p>
  </div>
);
