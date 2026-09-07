import type { ReactNode } from "react";

// Only these two tones exist, so a union type is better than a plain string.
export type NoticeTone = "error" | "good";

interface NoticeProps {
  children: ReactNode;
  tone?: NoticeTone;
}

export default function Notice({ children, tone = "error" }: NoticeProps) {
  if (!children) return null;

  return (
    <p className={"notice notice--" + tone} role="status">
      {children}
    </p>
  );
}
