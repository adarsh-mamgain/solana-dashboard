export interface ButtonProps {
  children: React.ReactNode;
  onClick: () => Promise<void>;
  disabled?: boolean;
}

export function Button({ onClick, children }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors"
    >
      {children}
    </button>
  );
}
