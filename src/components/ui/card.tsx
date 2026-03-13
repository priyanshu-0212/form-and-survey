import type { CSSProperties, ReactNode } from "react";
import { forwardRef } from "react";

export const Card = forwardRef<
  HTMLDivElement,
  { children: ReactNode; className?: string; style?: CSSProperties }
>(function Card({ children, className, style }, ref) {
  return (
    <div
      ref={ref}
      style={style}
      className={["ff-card", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
});

