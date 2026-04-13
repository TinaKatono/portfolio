import { Link } from "react-router-dom";
import { BrandSerif } from "./brand";

const brandLinkClass =
  "pointer-events-auto inline-flex max-w-full flex-wrap items-baseline justify-center gap-4 text-[32px] leading-none text-[#333] rounded-sm outline-none ring-offset-2 transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#333] no-underline";

/** ヒーロー縮小後相当（HeroTitleBlock shrink=1）と同じ見た目で中央固定（サブページ用） */
export function SiteCenterBrand() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-[28px]">
      <Link to="/" className={brandLinkClass} aria-label="トップページへ">
        <p className="whitespace-nowrap pr-4 text-center font-sans leading-none tracking-[-0.03em]">
          TINA
        </p>
        <BrandSerif>
          <span className="whitespace-nowrap leading-none tracking-[0.02em]">KATONO</span>
        </BrandSerif>
      </Link>
    </div>
  );
}
