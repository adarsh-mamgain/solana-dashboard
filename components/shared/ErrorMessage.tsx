interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <p className="text-red-500 bg-red-100 p-2 rounded">Error: {message}</p>
  );
}
