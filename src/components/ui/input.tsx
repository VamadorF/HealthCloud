import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

// Campos rectos, sin radio: parte de la dirección de arte del prototipo.
export const fieldStyles =
  'w-full border border-lineStrong bg-surface px-3 py-2.5 text-sm text-inkBody placeholder:text-inkMuted/60 outline-none transition-colors duration-200 ease-out-soft focus:border-brand-mid focus:ring-2 focus:ring-brand-soft disabled:cursor-not-allowed disabled:bg-canvas disabled:opacity-70';

export const fieldErrorStyles = 'border-accent focus:border-accent focus:ring-accent-soft';

export function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-xs font-bold text-inkMuted" htmlFor={htmlFor}>
      {children}
    </label>
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <FieldLabel htmlFor={props.id}>{label}</FieldLabel>}
        <input
          ref={ref}
          className={`${fieldStyles} ${error ? fieldErrorStyles : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-accent">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
