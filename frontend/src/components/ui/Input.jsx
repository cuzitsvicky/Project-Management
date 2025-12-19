export function Input({ className = "", ...props }) {
  const baseStyles = "flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
  
  return (
    <input
      className={`${baseStyles} ${className}`}
      {...props}
    />
  )
}

