import type { CSSProperties, ReactNode } from "react";
import mark1 from "../assets/fv/fv_1.svg";
import mark2 from "../assets/fv/fv_2.svg";
import mark3 from "../assets/fv/fv_3.svg";
import mark4 from "../assets/fv/fv_4.svg";
import mark4Eyes from "../assets/fv/fv_4_eyes.svg";
import eyesOverlay from "../assets/fv/eyes_under.svg";
import scrollHint from "../assets/fv/fv_5.svg";

/**
 * ロゴ・見出し・キャッチの単語間に挟むカラフルな図形。
 * 素材は src/assets/fv/ の 4 点。差し替えるときはファイルを置き換えるか、この配列の順序を変える。
 * 0=ピンクの角丸 / 1=青の星型 / 2=緑の扇形 / 3=黄色の四つ葉
 */
export const MARK_IMAGES = [mark1, mark2, mark3, mark4];

/**
 * 黄色の図形の「目玉あり」版。**FV のキャッチでのみ使う。**
 * 見出し・ロゴ・マルキーなど他の装飾では目玉なしの MARK_IMAGES[3] を使うこと
 * （小さく並ぶ場所で目玉が入ると、図形としての形が読み取りにくくなるため）。
 */
export const MARK_IMAGE_EYES = mark4Eyes;

/**
 * 目玉だけの透過画像。他の図形と同じ寸法なので、そのまま重ねれば位置が合う。
 * 青いギザギザ丸（MARK_IMAGES[1]）の上に重ね、**土台だけ回して目玉は回さない**用途。
 * InlineMark の overlaySrc に渡す。
 */
export const MARK_EYES_OVERLAY = eyesOverlay;

/**
 * FV のスクロール誘導に使う下向きの矢印。塗りは BRAND_COLORS.pink と同じ値。
 * **単語間に挟む図形ではないので MARK_IMAGES には入れない**
 * （入れるとロゴや見出しの語間にも回ってきてしまう）。
 * 正方形の viewBox の下寄りに絵柄があるので、上に 3 割ほど余白を持っている。
 */
export const SCROLL_HINT_MARK = scrollHint;

/**
 * 図形に使っている色。SVG 内の fill と同じ値なので、図形以外（CTA の丸など）で
 * 色を使うときはここから取れば全体のパレットからずれない。
 * 図形を追加・差し替えたときはここも合わせて更新する。
 */
export const BRAND_COLORS = {
  pink: "#FC81BF",
  blue: "#42A5F5",
  green: "#48B86E",
  yellow: "#FFC107",
} as const;

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
  overlaySrc,
  className = "",
  nudgeY = MARK_NUDGE_Y,
  spin = false,
  hoverRotate = false,
}: {
  src: string;
  /**
   * src の上に重ねる透過画像。**回転しない**ので、土台だけを回して
   * 上の絵柄は正位置に保ちたいとき（青いギザギザ丸＋目玉）に使う。
   */
  overlaySrc?: string;
  className?: string;
  /**
   * ベースライン補正の上書き。通常は既定値のままでよい。
   * 位置を測って調整する場合は、周囲の入場アニメーションを finish() させた状態で測ること
   * （アニメの 0% キーフレームが transform に乗っていると数値がずれる）。
   */
  nudgeY?: string;
  /** ゆっくり回し続ける */
  spin?: boolean;
  /**
   * 祖先の `group` がホバーされたら 90 度傾く。
   * 角度は CSS 変数で受け渡す。transform をクラスで上書きすると
   * インラインの位置補正（translateY）が消えてしまうため。
   */
  hoverRotate?: boolean;
}) {
  const hoverRotateClass = hoverRotate
    ? "transition-transform duration-[700ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:[--mark-rot:90deg] group-focus-within:[--mark-rot:90deg] motion-reduce:transition-none"
    : "";
  const spinClass = spin ? "animate-mark-spin motion-reduce:animate-none" : "";
  const boxStyle: CSSProperties = {
    width: MARK_SIZE,
    height: MARK_SIZE,
    // 回転しないときはこの transform が効く。spin するときは markSpin が
    // --mark-nudge-y を読んで同じ補正を合成する（animation が transform を上書きするため）。
    transform: `translateY(${nudgeY}) rotate(var(--mark-rot, 0deg))`,
    ["--mark-nudge-y" as string]: nudgeY,
  };

  if (!overlaySrc) {
    return (
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className={`inline-block shrink-0 object-contain ${spinClass} ${hoverRotateClass} ${className}`}
        style={boxStyle}
      />
    );
  }

  /*
    2 枚重ね。外側の span が位置補正とホバー回転を持ち、回し続ける spin は
    土台の img だけに掛ける。こうすると上に重ねた絵柄は回らない。
    土台側の --mark-nudge-y は 0 にする。外側で既に補正済みなので、
    markSpin のキーフレームが再度 translateY を足すと二重にずれる。
    inline-flex の包み要素はベースラインを変えない（実測で確認済み）。
  */
  return (
    <span
      className={`relative inline-flex shrink-0 ${hoverRotateClass} ${className}`}
      style={boxStyle}
      aria-hidden="true"
    >
      <img
        src={src}
        alt=""
        className={`absolute inset-0 h-full w-full object-contain ${spinClass}`}
        style={{ ["--mark-nudge-y" as string]: "0px" }}
      />
      <img
        src={overlaySrc}
        alt=""
        className="absolute inset-0 h-full w-full object-contain"
      />
    </span>
  );
}

/**
 * ロゴ・見出しの標準スタイル（折り返す見出し用）。サイト全体を太めのゴシックで統一している。
 * 文字サイズは呼び出し側で指定する。
 */
export const BRAND_TEXT_WRAP =
  "font-sans font-bold leading-none tracking-[-0.03em] text-[#333]";

/** 1 行で収める見出し用。折り返す見出しには BRAND_TEXT_WRAP を使う */
export const BRAND_TEXT = `whitespace-nowrap ${BRAND_TEXT_WRAP}`;

/** 単語と図形のあいだの余白（文字サイズ基準） */
export const BRAND_GAP = "0.1em";

/**
 * 小さい英字ラベルの標準スタイル（ROLE / YEAR / DURATION / TOOLS / DESIGN など）。
 *
 * ロゴ・見出し・ナビの「太ゴシック＋詰めた字間」とは別系統。**ラベルは中身より
 * 弱く**あるべきなので、字を小さく・字間を広くして、値（本文色）に主役を譲る。
 * 以前は 3 箇所でサイズも字間もバラバラで、詳細ページに至っては
 * ラベルが中身より大きい逆転が起きていた。
 *
 * **ラベルは英語、値は日本語。** 転職エージェントから「ROLE の欄が掴みづらい」と
 * 指摘を受けたことがあるが、原因はラベルではなく値だった（Information Architecture
 * のような英語の専門語が並んでいた）。ラベル側は ROLE / TOOLS という一般的な語で、
 * 値を読めば意味が取れるため英語のまま残している。値の専門語だけ日本語にしてある
 * （Figma や HTML のような固有名詞はそのまま）。
 *
 * 新しくラベルを足すときもこれを使う。大文字にするのは呼び出し側の文字列で行う
 * （uppercase を当てると読み上げの都合が悪いため）。
 */
export const META_LABEL =
  "font-sans text-[13px] font-semibold leading-none tracking-[0.12em]";

/**
 * メタ情報の「値」側。背景（#f5f7f8）の上に白地を敷いて一段持ち上げる。
 *
 * **パディングは付けない。** 文字幅ぴったりに地色が乗る、テキスト選択のような
 * あしらいを狙っている。折り返したときも 1 行ごとに独立した面にしたいので、
 * ブロックではなく inline で使い、box-decoration-clone で行ごとに背景を切る
 * （ブロックのままだと複数行が 1 枚の面になってしまう）。
 * flex の子は inline が block 化されるため、**必ず span などで包んで渡すこと**。
 */
export const META_VALUE =
  "box-decoration-clone bg-white font-sans text-[13px] leading-[1.6] tracking-[0.04em] text-[#333]";

/**
 * ホバー（およびキーボードフォーカス）で、下から同じ語がせり上がってくる見出し。
 * 高さ 1em の枠で 2 枚重ねをクリップし、レール全体を半分ずらすことで入れ替える。
 *
 * **呼び出し側の親要素に `group` クラスが必要**（`group-hover` / `group-focus-within` で駆動するため）。
 * 2 枚目の見た目は revealClassName / revealStyle で渡す。文字サイズや配色は
 * 置き場所によって変わる（CTA は 128px、ヘッダーは 16px）ため、ここでは決めない。
 */
export function HoverRevealWord({
  children,
  textClassName,
  wrapperClassName = "",
  revealClassName = "",
  revealStyle,
  motionClassName = "duration-[700ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
}: {
  children: ReactNode;
  textClassName: string;
  wrapperClassName?: string;
  revealClassName?: string;
  revealStyle?: CSSProperties;
  /** せり上がりの速さ・カーブ。置き場所で変える（大見出しはゆったり、ナビは機敏に） */
  motionClassName?: string;
}) {
  const rail = `block transition-transform ${motionClassName} group-hover:-translate-y-1/2 group-focus-within:-translate-y-1/2 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-focus-within:translate-y-0`;
  return (
    <span
      className={`inline-block h-[1em] overflow-hidden align-baseline ${textClassName} ${wrapperClassName}`}
    >
      <span className={rail}>
        <span className="block leading-none">{children}</span>
        <span className={`block leading-none ${revealClassName}`} style={revealStyle} aria-hidden>
          {children}
        </span>
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
