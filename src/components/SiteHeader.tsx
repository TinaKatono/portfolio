import { Link } from "react-router-dom";
import { SkewSerif } from "./brand";

/**
 * ナビのみの横幅・ビューポート右端寄せ。中央のブランド表示と重ならないよう、ヘッダー自体は全幅にしない。
 * 文字色は CSS の mix-blend-mode: difference で、背後に見えている背景色と差分合成し、明るい上では暗く・暗い上では明るく見える。
 */
export function SiteHeader() {
  return (
    <header
      className="pointer-events-none fixed right-0 top-0 z-50 flex h-20 items-center pr-6 supports-[mix-blend-mode:difference]:mix-blend-difference"
      aria-label="サイト内ナビゲーション"
    >
      <nav className="pointer-events-auto flex w-max max-w-[min(100vw-1.5rem,100%)] flex-wrap items-end justify-end gap-4 rounded-lg p-6 text-[16px] leading-none text-[#333] supports-[mix-blend-mode:difference]:text-white">
        <Link to="/#about" className="flex items-start">
          <span className="font-sans">ABOUT</span>
          <SkewSerif className="pl-1">
            <span className="text-[16px]">ME</span>
          </SkewSerif>
        </Link>
        <Link to="/#work" className="flex items-start">
          <span className="font-sans">RECENT</span>
          <SkewSerif className="pl-1">
            <span className="text-[16px]">WORKS</span>
          </SkewSerif>
        </Link>
        <Link to="/#contact" className="flex items-start">
          <span className="font-sans">GET IN</span>
          <SkewSerif className="pl-1">
            <span className="text-[16px]">TOUCH</span>
          </SkewSerif>
        </Link>
      </nav>
    </header>
  );
}
