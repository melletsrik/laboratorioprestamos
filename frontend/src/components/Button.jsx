export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`
        w-full px-6 py-3 
        bg-[var(--color-secondary)] 
        hover:bg-red-700 
        text-[var(--color-white)] 
        font-semibold 
        text-lg 
        rounded-lg 
        shadow-md 
        text-center 
        leading-tight 
        break-words 
        transition duration-300 
        m-2
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
