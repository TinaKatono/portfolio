import type { ReactNode } from "react";

export function SkewSerif({
  children,
  className = "",
  /** false にすると skew を外し、mix-blend などと合成しやすくする */
  skew = true,
}: {
  children: ReactNode;
  className?: string;
  skew?: boolean;
}) {
  return (
    <span className={`inline-flex items-center justify-center ${className}`}>
      <span
        className={
          skew
            ? "inline-block origin-center scale-y-[0.98] -skew-x-[11deg] font-serif not-italic tracking-wide"
            : "inline-block font-serif not-italic tracking-wide"
        }
      >
        {children}
      </span>
    </span>
  );
}

export function CtaArrow() {
  return (
    <svg
      width="18"
      height="8"
      viewBox="0 0 18 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
      aria-hidden="true"
    >
      <path
        d="M1 7L17 1M17 1H8M17 1V6"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
