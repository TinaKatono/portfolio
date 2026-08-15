import type { MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { BRAND_GAP, BRAND_TEXT, InlineMark, MARK_IMAGES } from "./brand";

export type SiteFooterProps = {
  /** 例: 子ページで `min-h-screen` レイアウトのとき `mt-auto` */
  className?: string;
};

export function SiteFooter({ className }: SiteFooterProps) {
  const { pathname } = useLocation();

  /**
   * トップページで押したときは遷移先が同じなので何も起きない。
   * クリックできる見た目である以上は反応を返したいので、ページ先頭へスクロールさせる。
   * 滑らかさはここで指定する。html 全体に scroll-behavior: smooth を掛けると、
   * ブラウザの戻る操作による位置復元まで滑らかになってしまうため
   * （毎回、最上部から前回位置まで流れて見える）。
   * prefers-reduced-motion のときは即座に移動する。
   */
  const onLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;
    // 修飾キー付き（別タブで開く等）はブラウザの既定動作に任せる
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduce ? "auto" : "smooth" });
  };

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
          onClick={onLogoClick}
          className="flex flex-nowrap items-baseline text-[clamp(28px,9vw,40px)] leading-none rounded-sm outline-none ring-offset-2 transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#333] no-underline"
          style={{ gap: BRAND_GAP }}
          aria-label={pathname === "/" ? "ページ先頭へ戻る" : "トップページへ"}
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
