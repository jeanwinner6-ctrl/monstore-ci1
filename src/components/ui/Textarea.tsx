import React from 'react';
interface TextareaProps extends
  React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}
export function Textarea({
  label,
  error,
  className = '',
  ...props
}: TextareaProps) {
  return (
    <div className="w-full">
      {label &&
      <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      }
      <textarea
        className={`
          block w-full rounded-md border-gray-300 shadow-sm 
          focus:border-[#FF6B00] focus:ring-[#FF6B00] sm:text-sm
          disabled:bg-gray-100 disabled:text-gray-500
          p-3 border
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props} />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>);

}