import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type BorderbuttonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
>;

export default function Borderbutton({
  children,
  className,
  ...props
}: BorderbuttonProps) {
  return (
    <button
      className={`border border-black px-8 py-2.5 uppercase tracking-[0.25em] transition-colors duration-300 hover:bg-black hover:text-white ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
