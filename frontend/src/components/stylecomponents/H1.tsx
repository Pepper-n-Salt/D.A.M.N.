import type { PropsWithChildren } from "react";

export default function H1({ children }: PropsWithChildren) {
  return <h1 className="text-red-700">{children}</h1>;
}
