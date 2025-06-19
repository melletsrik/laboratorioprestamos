export default function Button({ children, variant = "gray", className = "", ...props }) {
  const baseStyles = `
    w-full
    px-6 py-3
    m-2
    rounded-lg
    text-lg
    font-semibold
    text-center
    leading-tight
    break-words
    shadow-md
    transition duration-300
    cursor-pointer
  `;

  const variants = {
    gray: `
      bg-[var(--color-secondary)]
      hover:bg-[var(--color-terciary)]
      text-[var(--color-black)]
    `,
    red: `
      bg-[var(--color-primary)]
      hover:bg-red-800
      text-[var(--color-white)]
    `,
    white: `
      bg-[var(--color-white)]
      hover:bg-[var(--color-terciary)]
      text-[var(--color-black)]
    `,
    blue: `
      bg-blue-500
      hover:bg-blue-800
      text-white
    `,


  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.gray} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
