import type { ReactNode } from "react";

interface EmptyProps {
  title: string;
  children?: ReactNode;
}

// Shown wherever a list came back with nothing in it.
export default function Empty({ title, children }: EmptyProps) {
  return (
    <div className="empty">
      <p className="empty__title">{title}</p>
      {children ? <div className="empty__body">{children}</div> : null}
    </div>
  );
}
