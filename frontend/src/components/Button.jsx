export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`
        w-full
        px-6 py-3
        m-2
        rounded-lg
        bg-[var(--color-secondary)]
        hover:bg-[var(--color-terciary)]
        text-[var(--color-black)]
        text-lg
        font-semibold
        text-center
        leading-tight
        break-words
        shadow-md
        transition duration-300
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}