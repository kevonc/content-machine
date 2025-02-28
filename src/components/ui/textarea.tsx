import * as React from "react"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full px-4 py-3 bg-white border border-border rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 
          placeholder:text-muted ${className}`}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea } 