import { Link } from "react-router-dom";
import { BRAND_GAP, BRAND_TEXT, InlineMark, MARK_IMAGES } from "./brand";

/** ヒーロー縮小後相当（HeroTitleBlock shrink=1）と同じ見た目で中央固定（サブページ用） */
export function SiteCenterBrand() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-[28px]">
      <Link
        to="/"
        className="pointer-events-auto inline-flex max-w-full flex-nowrap items-baseline justify-center text-[32px] leading-none rounded-sm outline-none ring-offset-2 transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#333] no-underline"
        style={{ gap: BRAND_GAP }}
        aria-label="トップページへ"
      >
        <span className={BRAND_TEXT}>TINA</span>
        <InlineMark src={MARK_IMAGES[1]} spin />
        <span className={BRAND_TEXT}>KATONO</span>
      </Link>
    </div>
  );
}
