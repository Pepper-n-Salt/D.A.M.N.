import type { PropsWithChildren } from "react";

export default function P({ children }: PropsWithChildren) {
  return <p className="tracking-widest leading-loose">{children}</p>;
}
