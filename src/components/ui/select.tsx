import { SelectHTMLAttributes, forwardRef } from 'react';
import { FieldLabel, fieldStyles, fieldErrorStyles } from '@/components/ui/input';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, children, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <FieldLabel htmlFor={props.id}>{label}</FieldLabel>}
        <select
          ref={ref}
          className={`${fieldStyles} ${error ? fieldErrorStyles : ''} ${className}`}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
