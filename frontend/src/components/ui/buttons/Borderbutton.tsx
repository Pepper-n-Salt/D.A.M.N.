import type { PropsWithChildren } from "react";

export default function Borderbutton({ children }: PropsWithChildren) {
  return (
    <button className="border border-black px-8 py-2.5 uppercase tracking-[0.25em] transition-colors duration-300 hover:bg-black hover:text-white">
      {children}
    </button>
  );
}
