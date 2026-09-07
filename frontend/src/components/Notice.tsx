import type { ReactNode } from "react";

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
