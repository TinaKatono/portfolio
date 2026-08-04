import type { ReactNode } from "react";
import mark1 from "../assets/fv/fv_1.svg";
import mark2 from "../assets/fv/fv_2.svg";
import mark3 from "../assets/fv/fv_3.svg";
import mark4 from "../assets/fv/fv_4.svg";

/**
 * ロゴ・見出し・キャッチの単語間に挟むカラフルな図形。
 * 素材は src/assets/fv/ の 4 点。差し替えるときはファイルを置き換えるか、この配列の順序を変える。
 * 0=ピンクの角丸 / 1=青の星型 / 2=緑の扇形 / 3=黄色の四つ葉
 */
export const MARK_IMAGES = [mark1, mark2, mark3, mark4];

/** 図形のサイズ（文字サイズ基準）とベースライン補正 */
const MARK_SIZE = "1.05em";
const MARK_NUDGE_Y = "0.14em";

/**
 * 単語のあいだに置く図形。サイズは em 指定なので、置いた場所のフォントサイズに自動で追従する。
 * items-baseline の行内では画像の下端がベースラインに乗るため、nudgeY で見た目の中心を揃える。
 * object-contain なので図形が切れることはない（正方形に近い素材を想定）。
 */
export function InlineMark({
  src,
  className = "",
  nudgeY = MARK_NUDGE_Y,
  spin = false,
}: {
  src: string;
  className?: string;
  /** ベースライン補正の上書き。包み要素があってベースラインがずれる箇所で使う（例: ヒーローのロゴ） */
  nudgeY?: string;
  /** ゆっくり回し続ける */
  spin?: boolean;
}) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={`inline-block shrink-0 object-contain ${
        spin ? "animate-mark-spin motion-reduce:animate-none" : ""
      } ${className}`}
      style={{
        width: MARK_SIZE,
        height: MARK_SIZE,
        // 回転しないときはこの transform が効く。回転するときは markSpin が
        // --mark-nudge-y を読んで同じ補正を合成する（animation が transform を上書きするため）。
        transform: `translateY(${nudgeY})`,
        ["--mark-nudge-y" as string]: nudgeY,
      }}
    />
  );
}

/**
 * ロゴ・見出しの標準スタイル。サイト全体を太めのゴシックで統一している。
 * 文字サイズは呼び出し側で指定する。
 */
export const BRAND_TEXT = "whitespace-nowrap font-sans font-bold leading-none tracking-[-0.03em] text-[#333]";

/** 単語と図形のあいだの余白（文字サイズ基準） */
export const BRAND_GAP = "0.1em";

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

/**
 * 旧: ブランド表記の serif 部分。太ゴシック統一に伴い本文からは使わなくなったが、
 * 型・見た目を戻したくなったときのために残している。
 */
export function BrandSerif({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-baseline ${className}`}>
      <span className="inline-block translate-y-[0.055em] font-serif not-italic tracking-wide">
        {children}
      </span>
    </span>
  );
}
