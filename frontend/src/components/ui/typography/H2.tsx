import type { PropsWithChildren } from "react";

export default function H2({ children }: PropsWithChildren) {
  return (
    <h2 className="text-4xl font-light sm:text-4xl md:text-6xl lg:text-8xl text-neutral-500 uppercase mb-6">
      {children}
    </h2>
  );
}
