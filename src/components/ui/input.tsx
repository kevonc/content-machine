import * as React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-4 py-3 bg-white border border-border rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 
          placeholder:text-muted ${className}`}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input } 