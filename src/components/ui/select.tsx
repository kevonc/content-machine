import * as React from "react"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full px-4 py-3 bg-white border border-border rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 
          placeholder:text-muted ${className}`}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = "Select"

export { Select } 