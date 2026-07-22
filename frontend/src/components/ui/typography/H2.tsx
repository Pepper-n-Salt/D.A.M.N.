import type { PropsWithChildren } from "react";

export default function H2({ children }: PropsWithChildren) {
  return (
    <h2 className=" text-1xl font-light sm:text-1l md:text-1xl lg:text-2xl text-neutral-500 uppercase">
      {children}
    </h2>
  );
}
