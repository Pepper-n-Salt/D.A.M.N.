import type { PropsWithChildren } from "react";

export default function H1({ children }: PropsWithChildren) {
  return (
    <h1 className="text-5xl font-light sm:text-5xl md:text-7xl lg:text-9xl">
      {children}
    </h1>
  );
}
