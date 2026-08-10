import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  BRAND_GAP,
  BRAND_TEXT,
  HoverRevealWord,
  InlineMark,
  MARK_IMAGES,
} from "./brand";
/**
 * group を付けて HoverRevealWord のせり上がりを駆動する。
 * px/py と同じ量の負マージンで、見た目の位置は変えずに当たり判定だけ広げている
 * （文字ぴったりだと狙いにくい）。左右は 8px ずつなので、gap-4 の隣接項目とは
 * 判定が接するだけで重ならない。
 */
const navLinkClass =
  "group flex items-baseline gap-1 px-2 py-3 -mx-2 -my-3 font-sans font-bold tracking-[-0.02em] rounded-sm outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-current";

/**
 * ヘッダー内の要素をロゴと縦に揃えるための上余白。
 *
 * 揃える基準は **ベースラインではなく「大文字の見かけの中心」**。
 * 文字サイズが 32px と 16px で倍違うため、ベースラインを合わせると
 * 背の高いロゴだけが上に浮いて見える（実測で 6px ぶん高く見えていた）。
 * ロゴ（32px・上端 28px）の大文字中心は上端から 50.4px の位置にあり、
 * ナビとハンバーガーをそこへ合わせている。
 * 文字サイズやロゴの上端を変えたら測り直すこと。
 */
const NAV_TOP_PAD = "pt-[41px]";
/** ハンバーガー（44px の当たり判定・中央に 14px の三本線）の上余白 */
const BURGER_TOP_PAD = "mt-[28px]";

/** ナビのせり上がりは短く強めに立ち上げる（大見出しの 700ms だと鈍く感じる） */
const NAV_REVEAL_MOTION = "duration-[280ms] ease-[cubic-bezier(0.2,0.9,0.25,1)]";

/**
 * ナビはロゴ・見出しと同じ太ゴシックに揃えている。
 * ただし 16px と小さいため、単語間の図形（InlineMark）はここには入れていない。
 * この大きさだと図形が潰れて識別できず、項目間の区切りも曖昧になる。
 *
 * 2 枚目は 1 枚目と同じ配色のまま（16px では白抜き＋縁取りが読みにくかったため、
 * 動きだけでホバーを伝える）。色を足さないので mix-blend の内外を気にする必要もない。
 */
function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const word = (text: string) => (
    <HoverRevealWord textClassName="" motionClassName={NAV_REVEAL_MOTION}>
      {text}
    </HoverRevealWord>
  );
  return (
    <>
      <Link to="/#about" className={navLinkClass} onClick={onNavigate}>
        {word("ABOUT")}
        {word("ME")}
      </Link>
      {/* セクション見出しと同じ語にする（以前は RECENT WORKS で単複も割れていた） */}
      <Link to="/#work" className={navLinkClass} onClick={onNavigate}>
        {word("WORK")}
        {word("INDEX")}
      </Link>
      <Link to="/contact" className={navLinkClass} onClick={onNavigate}>
        {word("GET IN")}
        {word("TOUCH")}
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
      /*
        ドロワー（z-[200]）より上に置く。こうしないとハンバーガーが panel の裏に隠れ、
        3 本線 → バツの変形も閉じるボタンも見えなくなる。
        pointer-events-none なのでナビ以外の場所はクリックを奪わない。
      */
      className={`pointer-events-none fixed right-0 top-0 z-[210] isolate flex h-20 items-start pr-4 transition-opacity duration-500 ease-out supports-[mix-blend-mode:difference]:mix-blend-difference motion-reduce:transition-none sm:pr-6 ${
        revealNav ? "opacity-100" : "opacity-0"
      }`}
      aria-label="サイト内ナビゲーション"
    >
      {/*
        md 以上: 従来の横並び（折り返しなし）。
        中央ロゴ（32px・上端 28px）と縦位置を揃えるため、上余白を NAV_TOP_PAD で決めている。
        ロゴ側の 28px は SiteCenterBrand の pt と HeroTitleBlock の topMin に対応する固定値。
      */}
      <nav
        className={`hidden w-max max-w-none flex-nowrap items-end justify-end gap-4 rounded-lg px-6 pb-6 text-[16px] leading-none text-[#333] supports-[mix-blend-mode:difference]:text-white md:flex ${NAV_TOP_PAD} ${navPointer}`}
        aria-label="ページ内リンク"
      >
        <NavLinks />
      </nav>

      {/* 狭い画面: ハンバーガー */}
      {/*
        ヘッダーの縦中央（self-center）だとロゴより 10px 高い位置に来てしまうので、
        ロゴの大文字中心に合わせて自前で下げている（BURGER_TOP_PAD の項参照）。
      */}
      <div className={`relative ${BURGER_TOP_PAD} md:hidden ${navPointer}`}>
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

        {/*
          閉じるときもスライドを見せたいので、常にマウントしたまま class で開閉する
          （アンマウントすると退場アニメーションが再生されない）。
          transition に visibility を含めるのが要点: visibility は離散的に補間されるため、
          開くときは即 visible、閉じるときは移動し終わってから hidden になる。
          hidden のあいだは支援技術からもクリック判定からも外れる。
          ヘッダー親の mix-blend の影響を受けないよう body 直下へ portal する。
        */}
        {createPortal(
          <div
            id={menuId}
            /* md 以上ではハンバーガー自体が出ないので、パネルも存在させない */
            className={`fixed inset-0 z-[200] flex min-h-[100dvh] w-full flex-col bg-white px-6 pb-10 pt-24 text-[#222] transition-[transform,visibility] duration-[420ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none md:hidden ${
              menuOpen
                ? "visible translate-x-0"
                : "invisible translate-x-full"
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="サイトメニュー"
          >
            {/*
              パネルは全幅・不透過なので、後ろにあるページのロゴは隠れる。
              メニュー中もブランドが見えるよう、ヘッダーと同じ体裁のロゴをここに置く。
            */}
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="absolute left-1/2 top-0 flex -translate-x-1/2 flex-nowrap items-baseline pt-[28px] text-[32px] leading-none no-underline"
              style={{ gap: BRAND_GAP }}
              aria-label="トップページへ"
            >
              <span className={BRAND_TEXT}>TINA</span>
              <InlineMark src={MARK_IMAGES[1]} spin />
              <span className={BRAND_TEXT}>KATONO</span>
            </Link>

            <nav
              className="mt-16 flex flex-col gap-8 text-[22px] leading-none"
              aria-label="ページ内リンク"
            >
              <NavLinks onNavigate={() => setMenuOpen(false)} />
            </nav>
          </div>,
          document.body,
        )}
      </div>
    </header>
  );
}
