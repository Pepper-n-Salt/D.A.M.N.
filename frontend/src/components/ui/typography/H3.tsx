import type { PropsWithChildren } from "react";

export default function H3({ children }: PropsWithChildren) {
  return (
    <h3 className=" text-1xl tracking-tight sm:text-1xl md:text-2xl lg:text-3xl font-light">
      {children}
    </h3>
  );
}
