import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type CarouselButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
>;

export default function CarouselButton({
  children,
  ...props
}: CarouselButtonProps) {
  return (
    <button
      {...props}
      className="px-8 py-3 uppercase tracking-[0.2em] transition-colors duration-300   disabled:cursor-not-allowed disabled:opacity-30 hover:underline"
    >
      {children}
    </button>
  );
}
