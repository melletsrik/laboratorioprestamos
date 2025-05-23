// Input.jsx
export default function Input({
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  pattern,
  maxLength,
  inputMode,
  className = "",
  ...props
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      pattern={pattern}
      maxLength={maxLength}
      inputMode={inputMode}
      className={`
        w-full px-4 py-2 mt-1 
        border rounded-md 
        border-[var(--color-primary)] 
        focus:outline-none 
        shadow-sm 
        ${className}
      `}
      {...props}
    />
  );
}
