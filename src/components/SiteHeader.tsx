import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { BrandSerif } from "./brand";

const navLinkClass =
  "flex items-baseline rounded-sm outline-none ring-offset-2 transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-current";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <Link to="/#about" className={navLinkClass} onClick={onNavigate}>
        <span className="font-sans">ABOUT</span>
        <BrandSerif className="pl-1">
          <span className="text-[16px]">ME</span>
        </BrandSerif>
      </Link>
      <Link to="/#work" className={navLinkClass} onClick={onNavigate}>
        <span className="font-sans">RECENT</span>
        <BrandSerif className="pl-1">
          <span className="text-[16px]">WORKS</span>
        </BrandSerif>
      </Link>
      <Link to="/contact" className={navLinkClass} onClick={onNavigate}>
        <span className="font-sans">GET IN</span>
        <BrandSerif className="pl-1">
          <span className="text-[16px]">TOUCH</span>
        </BrandSerif>
      </Link>
    </>
  );
}

/**
 * ナビのみの横幅・ビューポート右端寄せ。中央のブランド表示と重ならないよう、ヘッダー自体は全幅にしない。
 * 文字色は CSS の mix-blend-mode: difference で、背後に見えている背景色と差分合成し、明るい上では暗く・暗い上では明るく見える。
 * 狭い画面では折り返しによる崩れを避けるためハンバーガー＋ドロワー。
 */
export function SiteHeader({ revealNav = true }: { revealNav?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  const navPointer =
    revealNav ? "pointer-events-auto" : "pointer-events-none";

  return (
    <header
      className={`pointer-events-none fixed right-0 top-0 z-[60] isolate flex h-20 items-center pr-4 transition-opacity duration-500 ease-out supports-[mix-blend-mode:difference]:mix-blend-difference motion-reduce:transition-none sm:pr-6 ${
        revealNav ? "opacity-100" : "opacity-0"
      }`}
      aria-label="サイト内ナビゲーション"
    >
      {/* md 以上: 従来の横並び（折り返しなし） */}
      <nav
        className={`hidden w-max max-w-none flex-nowrap items-end justify-end gap-4 rounded-lg p-6 text-[16px] leading-none text-[#333] supports-[mix-blend-mode:difference]:text-white md:flex ${navPointer}`}
        aria-label="ページ内リンク"
      >
        <NavLinks />
      </nav>

      {/* 狭い画面: ハンバーガー */}
      <div className={`relative md:hidden ${navPointer}`}>
        <button
          type="button"
          className="relative z-[100] pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#333] supports-[mix-blend-mode:difference]:text-white"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="relative block h-[14px] w-[22px]">
            <span
              className={`absolute left-0 top-0 block h-[2px] w-full bg-current transition-transform duration-200 ease-out motion-reduce:transition-none ${
                menuOpen ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[6px] block h-[2px] w-full bg-current transition-opacity duration-200 ease-out motion-reduce:transition-none ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-[12px] block h-[2px] w-full bg-current transition-transform duration-200 ease-out motion-reduce:transition-none ${
                menuOpen ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>

        {menuOpen
          ? createPortal(
              <>
                {/* ヘッダー親の mix-blend 外に出して不透過のスクリム＋パネルにする */}
                <button
                  type="button"
                  className="pointer-events-auto fixed inset-0 z-[200] cursor-default bg-neutral-950/55 backdrop-blur-md"
                  aria-label="メニューを閉じる"
                  tabIndex={-1}
                  onClick={() => setMenuOpen(false)}
                />
                <div
                  id={menuId}
                  className="pointer-events-auto fixed right-0 top-0 z-[201] flex max-h-[100dvh] min-h-[100dvh] w-[min(88vw,300px)] flex-col border-l border-neutral-200 bg-white px-6 pb-10 pt-20 text-[#222] shadow-2xl"
                  role="dialog"
                  aria-modal="true"
                  aria-label="サイトメニュー"
                >
                  <nav
                    className="flex flex-col gap-8 text-[18px] leading-none"
                    aria-label="ページ内リンク"
                  >
                    <NavLinks onNavigate={() => setMenuOpen(false)} />
                  </nav>
                </div>
              </>,
              document.body
            )
          : null}
      </div>
    </header>
  );
}
