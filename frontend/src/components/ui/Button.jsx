export function Button({ children, className = "", variant = "default", size = "default", ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    ghost: "bg-transparent hover:bg-gray-100"
  }
  
  const sizes = {
    default: "h-10 px-4 py-2",
    lg: "h-12 px-8 py-3 text-lg"
  }
  
  const variantClass = variants[variant] || variants.default
  const sizeClass = sizes[size] || sizes.default
  
  return (
    <button
      className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

