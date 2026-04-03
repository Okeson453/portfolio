import { createContext, useContext, ReactNode } from 'react';

/**
 * Compound Form Component Pattern
 * 
 * Provides automatic accessibility wiring for all form fields.
 * No manual aria-label, aria-describedby, or htmlFor needed.
 * 
 * @example
 * <Form.Field name="email" label="Email" required error={errors.email}>
 *   <Form.Label />
 *   <Form.Control type="email" placeholder="..." />
 *   <Form.Error />
 * </Form.Field>
 */

interface FormFieldContextValue {
  id: string;
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
  description?: string;
  touched?: boolean;
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

export function useFormField(): FormFieldContextValue {
  const context = useContext(FormFieldContext);
  if (!context) {
    throw new Error('useFormField must be used within Form.Field');
  }
  return context;
}

// ─────────────────────────────────────────────────────────────

interface FormFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
  description?: string;
  touched?: boolean;
  children: ReactNode;
}

/**
 * Form.Field — Root compound component wrapper
 * Manages context for label, input, error, and description
 */
export function FormField({
  name,
  label,
  required,
  error,
  description,
  touched,
  children,
}: FormFieldProps) {
  const id = name.toLowerCase().replace(/\s+/g, '-');

  return (
    <FormFieldContext.Provider
      value={{ id, name, label, required, error, description, touched }}
    >
      <div className="flex flex-col gap-1.5">
        {children}
      </div>
    </FormFieldContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────

/**
 * Form.Label — Auto-linked label with accessibility attributes
 */
export function FormLabel({ children }: { children: ReactNode }) {
  const { id, required, label: contextLabel } = useFormField();
  const displayLabel = children || contextLabel;

  return (
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {displayLabel}
      {required && (
        <>
          <span aria-hidden="true" className="text-red-500 ml-1">
            *
          </span>
          <span className="sr-only"> (required)</span>
        </>
      )}
    </label>
  );
}

// ─────────────────────────────────────────────────────────────

interface FormControlProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  as?: 'input' | 'textarea';
}

/**
 * Form.Control — Input/Textarea with auto-wired accessibility
 */
export function FormControl({
  as = 'input',
  ...props
}: FormControlProps) {
  const { id, name, required, error, description, touched } = useFormField();

  const describedByIds = [
    description && `${id}-desc`,
    error && `${id}-error`,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  const Component = as === 'textarea' ? 'textarea' : 'input';

  return (
    <Component
      id={id}
      name={name}
      required={required}
      aria-required={required}
      aria-invalid={error ? 'true' : 'false'}
      aria-describedby={describedByIds}
      className={`
        px-4 py-2 border rounded-lg text-sm
        transition-all focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-blue-500
        focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400
        disabled:cursor-not-allowed disabled:opacity-50
        placeholder:text-gray-500 dark:placeholder:text-gray-400
        ${
          error
            ? 'border-red-500 dark:border-red-400'
            : 'border-gray-300 dark:border-gray-600'
        } ${
        as === 'textarea'
          ? 'resize-none min-h-[100px] font-mono text-xs'
          : 'h-11 w-full'
      }
      `}
      {...(props as any)}
    />
  );
}

// ─────────────────────────────────────────────────────────────

/**
 * Form.Description — Optional helper text below input
 */
export function FormDescription({ children }: { children: ReactNode }) {
  const { id } = useFormField();

  return (
    <p
      id={`${id}-desc`}
      className="text-xs text-gray-500 dark:text-gray-400 mt-1"
    >
      {children}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────

/**
 * Form.Error — Error message with accessibility role
 */
export function FormError() {
  const { id, error } = useFormField();

  if (!error) {
    return null;
  }

  return (
    <p
      id={`${id}-error`}
      role="alert"
      className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium"
    >
      {error}
    </p>
  );
}

// ─────────────────────────────────────────────────────────────

// Export as compound component
export const Form = {
  Field: FormField,
  Label: FormLabel,
  Control: FormControl,
  Description: FormDescription,
  Error: FormError,
};
