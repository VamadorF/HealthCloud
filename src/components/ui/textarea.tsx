import { TextareaHTMLAttributes, forwardRef } from 'react';
import { FieldLabel, fieldStyles, fieldErrorStyles } from '@/components/ui/input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <FieldLabel htmlFor={props.id}>{label}</FieldLabel>}
        <textarea
          ref={ref}
          className={`${fieldStyles} ${error ? fieldErrorStyles : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
