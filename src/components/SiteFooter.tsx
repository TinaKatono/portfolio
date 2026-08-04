import { Link } from "react-router-dom";
import { BRAND_GAP, BRAND_TEXT, InlineMark, MARK_IMAGES } from "./brand";

export type SiteFooterProps = {
  /** 例: 子ページで `min-h-screen` レイアウトのとき `mt-auto` */
  className?: string;
};

export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer
      className={[
        "relative z-10 w-full border-t border-[#cfd8dc] bg-[#f5f7f8] pb-8 pt-8 md:pb-10 md:pt-10",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto flex w-full flex-col gap-6 px-6 md:flex-row md:items-end md:justify-between md:gap-10 md:px-10">
        <Link
          to="/"
          className="flex flex-nowrap items-baseline text-[clamp(28px,9vw,40px)] leading-none rounded-sm outline-none ring-offset-2 transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#333] no-underline"
          style={{ gap: BRAND_GAP }}
          aria-label="トップページへ"
        >
          <span className={BRAND_TEXT}>TINA</span>
          <InlineMark src={MARK_IMAGES[1]} spin />
          <span className={BRAND_TEXT}>KATONO</span>
        </Link>
        <p className="m-0 shrink-0 font-jp text-sm leading-[1.6] tracking-[0.02em] text-[#333] md:text-right md:text-xl">
          © 2026 Tina Katono
        </p>
      </div>
    </footer>
  );
}
