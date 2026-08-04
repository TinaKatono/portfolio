import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { Link } from "react-router-dom";
import {
  BRAND_GAP,
  BRAND_TEXT,
  CtaArrow,
  InlineMark,
  MARK_IMAGES,
} from "./components/brand";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { hasWorkDetail } from "./data/workDetails";
import { workItems, type WorkItem } from "./data/workItems";

/** カーソル（またはフォーカス基準点）からツールチップ左上へのずらし — カーソルと文字が重ならないようにする */
const WORK_ROLE_CURSOR_OFFSET = { x: 14, y: 14 };

function GetInTouchHeadlineWord({
  children,
  textClassName,
  wrapperClassName = "",
}: {
  children: ReactNode;
  textClassName: string;
  wrapperClassName?: string;
}) {
  const rail =
    "block transition-transform duration-[700ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:-translate-y-1/2 group-focus-within:-translate-y-1/2 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-focus-within:translate-y-0";
  return (
    <span
      className={`inline-block h-[1em] overflow-hidden align-baseline text-[#333] ${textClassName} ${wrapperClassName}`}
    >
      <span className={rail}>
        <span className="block leading-none">{children}</span>
        <span className="block leading-none" aria-hidden>
          {children}
        </span>
      </span>
    </span>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function invLerp(a: number, b: number, x: number) {
  return clamp((x - a) / (b - a), 0, 1);
}

function smoothstep(t: number) {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

/** セクション間の重なり量（ヒーロー←ABOUT、ABOUT←WORK で共通。1 箇所で調整） */
const overlapStyle = {
  ["--section-overlap" as string]: "min(100svh, 56rem)",
} as CSSProperties;

/** 右コピー完了 ≒ 3要素が横並びに揃ったタイミング */
const P_TRIO_DONE = 0.58;
/** 0〜1 でヒーロー見出しが大→小＆上へ。終端は P_TRIO_DONE より手前に置く */
const P_TITLE_SHRINK_END = 0.48;

/** ファーストビュー：名前の一文字ずつ出現（delay の間隔・語間） */
const HERO_INTRO_CHAR_STAGGER_MS = 68;
const HERO_INTRO_WORD_GAP_MS = 180;
/** ヒーロー内でこれ以上スクロールしたら scroll 誘導を消す（ヒーロー先頭からの距離） */
const HERO_SCROLL_HINT_MAX_OFFSET = 480;
/**
 * ヒーローのロゴだけ、図形をアニメーション用の span で包む分ベースラインが 0.12em 下がる。
 * その差を引いた補正値。他の見出し（InlineMark を直接置いている箇所）の既定は 0.14em。
 */
const HERO_MARK_NUDGE_Y = "0.02em";

/**
 * FV 見出しの文字サイズ。行は折り返さず横一列に伸ばし、各行が画面幅の 7〜8 割を占めるようにする。
 * 画像もこのサイズ基準（em）で決まるので、ここを変えれば文字と画像がまとめて追従する。
 *
 * 8vw が主役。画面幅に比例させることで、どの幅でも占有率がほぼ一定（右行で約 78%）になる。
 * min(..., 22vh) は縦が浅いウィンドウ（横長・低い画面）で 2 行が縦にはみ出すのを防ぐ保険。
 * 148px の上限は超ワイドディスプレイで文字が破綻するほど大きくならないための頭打ち。
 */
const FV_FONT_SIZE = "clamp(26px, min(8vw, 22vh), 148px)";
/**
 * FV の 2 行を画面中央からどれだけ上下にずらすか。
 * 行の高さが約 1.5em なので、0.7em で 2 行がわずかに離れて並ぶ。
 * em はコンテナの FV_FONT_SIZE 基準なので、文字サイズを変えても間隔比が保たれる。
 */
const FV_LINE_OFFSET = "0.7em";
/**
 * FV：定位置へ寄ってくる間のぼかし量（px）。ヒーロー名の heroCharIn と同じ「ぼけ→くっきり」の演出を、
 * こちらはスクロール進捗に連動させている。大きくしすぎるとスクロール中の再描画が重くなる。
 */
const FV_SETTLE_BLUR_PX = 42;
/**
 * キャッチの文言と、単語のあいだに入れる図形。**FV と WORK 下のマルキーの両方がここを参照する**ので、
 * 文言を変えるときはこの 1 箇所を直せば両方に反映される。
 *
 * ロゴ・見出しがすべて大文字なので、キャッチも大文字で揃えている。
 * ただし `by` だけは小文字のまま残し、LOGIC / DESIGN の 2 語を立たせている。
 * marks[i] は words[i] の直後に入る図形（最後の語の後ろには入れないので undefined）。
 */
const FV_LINES = [
  { words: ["DRIVEN", "by", "LOGIC,"], marks: [MARK_IMAGES[0], MARK_IMAGES[1]] },
  { words: ["DEFINED", "by", "DESIGN."], marks: [MARK_IMAGES[2], MARK_IMAGES[3]] },
];
/**
 * ゆっくり回し続ける図形。ロゴの図形と同じ fv_2.svg（青い星型）を回す。
 * 星型は回転が素直に読める形なので、他の図形と違って動かしても崩れない。
 * FV のキャッチでは「左行の 2 つ目」がこれに当たる。
 */
const SPINNING_MARK = MARK_IMAGES[1];

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function WorkRoleRow({ item }: { item: WorkItem }) {
  const rowRef = useRef<HTMLDivElement | HTMLAnchorElement>(null);
  const [tipPos, setTipPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  /** 行に入るたびに増やしてツールチップを差し替え、入場アニメを毎回再生する */
  const [tipBurst, setTipBurst] = useState(0);
  const visible = hover || focused;
  const hasDetailPage = hasWorkDetail(item.id);

  const syncPosFromMouse = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTipPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  const placeTipCentered = () => {
    const el = rowRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    setTipPos({ x: width * 0.4, y: height / 2 });
  };

  const rowClassName =
    "relative flex h-24 md:h-24 items-center justify-between gap-4 px-4 transition-colors duration-200 ease-out hover:bg-[#eceff1] focus-visible:bg-[#eceff1] focus-visible:outline-none motion-reduce:transition-none " +
    (hasDetailPage ? "cursor-pointer" : "cursor-default");

  const rowBody = (
    <>
      <p className="min-w-0 flex-1 font-sans md:text-[16px] text-[12px] leading-[1.8] tracking-[0.08em] text-[#333]">
        {item.title}
      </p>
      <div
        className="pointer-events-none absolute left-0 top-0 z-10"
        style={{
          transform: `translate(${tipPos.x + WORK_ROLE_CURSOR_OFFSET.x}px, ${tipPos.y + WORK_ROLE_CURSOR_OFFSET.y}px)`,
        }}
      >
        <div
          id={`work-role-${item.id}`}
          key={tipBurst}
          role="tooltip"
          aria-hidden={!visible}
          className={
            visible
              ? "max-w-[240px] origin-top-left rounded-[2px] border border-[#b0bec5] bg-white p-4 shadow-[0_8px_24px_rgba(51,51,51,0.08)] motion-reduce:animate-none animate-work-role-tip-in"
              : "max-w-[240px] origin-top-left rounded-[2px] border border-transparent bg-transparent p-4 opacity-0 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none translate-y-1 scale-[0.94]"
          }
        >
          <p
            className={`font-sans text-[13px] leading-[1.5] tracking-[0.04em] text-[#333] ${
              visible ? "motion-reduce:animate-none animate-work-role-text-in" : ""
            }`}
          >
            {item.roles.join(", ")}
          </p>
        </div>
      </div>
      <div
        className="aspect-video h-16 shrink-0 overflow-hidden bg-[#eceff1]"
        aria-hidden="true"
      >
        {item.thumbSrc && (
          <img
            src={item.thumbSrc}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
    </>
  );

  const interactionHandlers = {
    onMouseEnter: (e: MouseEvent<HTMLElement>) => {
      setHover(true);
      syncPosFromMouse(e);
      setTipBurst((n) => n + 1);
    },
    onMouseMove: (e: MouseEvent<HTMLElement>) => {
      syncPosFromMouse(e);
    },
    onMouseLeave: () => {
      setHover(false);
    },
    onFocus: () => {
      setFocused(true);
      placeTipCentered();
      setTipBurst((n) => n + 1);
    },
    onBlur: () => setFocused(false),
  };

  return (
    <>
      <div className="h-px w-full bg-[#b0bec5]" />
      {hasDetailPage ? (
        <Link
          ref={rowRef as RefObject<HTMLAnchorElement>}
          to={`/works/${item.id}`}
          className={rowClassName}
          aria-describedby={`work-role-${item.id}`}
          {...interactionHandlers}
        >
          {rowBody}
        </Link>
      ) : (
        <div
          ref={rowRef as RefObject<HTMLDivElement>}
          className={rowClassName}
          tabIndex={0}
          aria-describedby={`work-role-${item.id}`}
          {...interactionHandlers}
        >
          {rowBody}
        </div>
      )}
    </>
  );
}

function HeroTitleBlock({
  shrink,
  reduceMotion,
  onTitleIntroComplete,
}: {
  shrink: number;
  reduceMotion: boolean;
  onTitleIntroComplete?: () => void;
}) {
  const [mdUp, setMdUp] = useState(
    () =>
      typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setMdUp(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const [vh, setVh] = useState(
    () => (typeof window !== "undefined" ? window.innerHeight : 800),
  );
  const [rowH, setRowH] = useState(0);
  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /** 縮小完了時の上端オフセット（translate の終端） */
  const topMin = mdUp ? 28 : 20;
  const fontPx =
    (mdUp ? 32 : 22) +
    ((mdUp ? 160 : 54) - (mdUp ? 32 : 22)) * (1 - shrink);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const [fitScale, setFitScale] = useState(1);
  const lastCharRef = useRef<HTMLSpanElement | null>(null);
  const introDoneRef = useRef(false);

  const tina = "TINA";
  const katono = "KATONO";
  const katonoBaseMs = tina.length * HERO_INTRO_CHAR_STAGGER_MS + HERO_INTRO_WORD_GAP_MS;

  useEffect(() => {
    if (introDoneRef.current) return;
    if (reduceMotion) {
      introDoneRef.current = true;
      onTitleIntroComplete?.();
      return;
    }
    const el = lastCharRef.current;
    if (!el) {
      introDoneRef.current = true;
      onTitleIntroComplete?.();
      return;
    }
    const finish = () => {
      if (introDoneRef.current) return;
      introDoneRef.current = true;
      onTitleIntroComplete?.();
    };
    el.addEventListener("animationend", finish, { once: true });
    const fallbackMs =
      katonoBaseMs + (katono.length - 1) * HERO_INTRO_CHAR_STAGGER_MS + 700;
    const t = window.setTimeout(finish, fallbackMs);
    return () => {
      clearTimeout(t);
      el.removeEventListener("animationend", finish);
    };
  }, [reduceMotion, onTitleIntroComplete, katono.length, katonoBaseMs]);

  useLayoutEffect(() => {
    const measure = () => {
      const wrap = containerRef.current;
      const row = rowRef.current;
      if (!wrap || !row) return;
      const cs = getComputedStyle(wrap);
      const pl = parseFloat(cs.paddingLeft) || 0;
      const pr = parseFloat(cs.paddingRight) || 0;
      const maxW = wrap.clientWidth - pl - pr;
      const w = row.scrollWidth;
      if (maxW <= 0 || w <= 0) {
        setFitScale(1);
        return;
      }
      setFitScale(w > maxW ? maxW / w : 1);
    };
    measure();
    const wrap = containerRef.current;
    if (typeof ResizeObserver === "undefined" || !wrap) {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [fontPx, shrink, mdUp]);

  const charClass = reduceMotion
    ? "inline-block"
    : "inline-block animate-hero-char-in motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:blur-none";
  /**
   * 図形を包む span は inline-block にしない。inline-block だと中のテキスト用ストラットの分だけ
   * span のベースラインがずれ、図形が文字より 0.37em ほど下がってしまう。
   * inline-flex にすると span のベースラインが図形の下端そのものになり、他の見出しと同じ位置に揃う。
   */
  const markWrapClass = charClass.replace("inline-block", "inline-flex");

  const sizedFontPx = fontPx * fitScale;

  useLayoutEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const measure = () => setRowH(el.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sizedFontPx, fitScale, mdUp]);

  const rowHeight = rowH > 0 ? rowH : sizedFontPx;
  /**
   * shrink=0 で画面の縦中央、shrink=1 で上寄せ（行の上端が topMin）。
   * 中央写真を廃止して FV の中央が空いたため、PC でも SP と同じく中央から始めて上へ集約させる。
   */
  const shiftY = shrink * (topMin + rowHeight / 2 - vh / 2);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-[2] flex min-h-0 w-full flex-col items-center justify-center px-5 sm:px-6 md:px-8"
    >
      <div
        ref={rowRef}
        className="inline-flex max-w-full min-w-0 flex-nowrap items-baseline justify-center whitespace-nowrap"
        style={{
          fontSize: `${sizedFontPx}px`,
          lineHeight: 1,
          gap: BRAND_GAP,
          transform: `translateY(${shiftY}px)`,
        }}
      >
        <p className={`m-0 text-center ${BRAND_TEXT}`}>
          {tina.split("").map((ch, i) => (
            <span
              key={`tina-${i}`}
              className={charClass}
              style={
                reduceMotion
                  ? undefined
                  : { animationDelay: `${i * HERO_INTRO_CHAR_STAGGER_MS}ms` }
              }
            >
              {ch}
            </span>
          ))}
        </p>
        {/* 図形も 1 文字と同じ扱いで入場させる（TINA の直後、KATONO の直前のタイミング） */}
        <span
          className={markWrapClass}
          style={
            reduceMotion
              ? undefined
              : { animationDelay: `${tina.length * HERO_INTRO_CHAR_STAGGER_MS}ms` }
          }
        >
          <InlineMark src={MARK_IMAGES[1]} nudgeY={HERO_MARK_NUDGE_Y} spin />
        </span>
        <span className={BRAND_TEXT}>
          {katono.split("").map((ch, i) => (
            <span
              key={`katono-${i}`}
              ref={i === katono.length - 1 ? lastCharRef : undefined}
              className={charClass}
              style={
                reduceMotion
                  ? undefined
                  : {
                      animationDelay: `${katonoBaseMs + i * HERO_INTRO_CHAR_STAGGER_MS}ms`,
                    }
              }
            >
              {ch}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

/** WORK 直下：1コピー分（無限マルquee用に2つ並べる） */
function WorkBelowMarqueeStrip({
  textClass = "text-[clamp(28px,5.5vw,64px)]",
  phraseColorClass = "text-[#333]",
  toneClass = "",
  ariaHidden = false,
}: {
  textClass?: string;
  phraseColorClass?: string;
  /** 写真上レイヤー用 text-shadow（filter はレイヤーごとにずれやすい） */
  toneClass?: string;
  ariaHidden?: boolean;
}) {
  // FV のキャッチと同じ語なので、書体・大小・図形の入れ方も FV に合わせる
  const word = `${BRAND_TEXT} ${phraseColorClass} ${toneClass}`.trim();
  /**
   * 2 文を 2 回繰り返して 1 コピー分。単語を平坦に並べ、**すべての語間**に図形を挟む。
   * 文の境目（DESIGN. と DRIVEN のあいだ）も語間として扱わないと文字が隣接してしまう。
   */
  const words = [0, 1].flatMap(() => FV_LINES.flatMap((line) => line.words));

  return (
    <div
      className={`flex shrink-0 flex-nowrap items-baseline pr-12 leading-none md:pr-0 ${textClass}`}
      style={{ gap: BRAND_GAP }}
      aria-hidden={ariaHidden || undefined}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className={word}>{w}</span>
          {i < words.length - 1 ? (
            <InlineMark src={MARK_IMAGES[i % MARK_IMAGES.length]} />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}

/** ページ縦スクロール1px あたりマルqueeが動く横方向ピクセル（下スクロールで左へ） */
const WORK_BELOW_STATEMENT_SCROLL_PX_PER_Y = 0.6;

/**
 * 黒／白の2トラックに同一の translate を適用。位置は window スクロール連動（ループ1周分でモジュロ）
 */
function WorkBelowStatementMarquee({
  textClass,
  scrollY,
}: {
  textClass: string;
  scrollY: number;
}) {
  const darkTrackRef = useRef<HTMLDivElement>(null);
  const [loopW, setLoopW] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useLayoutEffect(() => {
    const el = darkTrackRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.scrollWidth;
      if (w > 0) setLoopW(w / 2);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [textClass]);

  useLayoutEffect(() => {
    const darkEl = darkTrackRef.current;
    if (!darkEl) return;
    if (reduceMotion || loopW <= 0) {
      darkEl.style.transform = "translate3d(0,0,0)";
      return;
    }
    const travel = scrollY * WORK_BELOW_STATEMENT_SCROLL_PX_PER_Y;
    const x = -((travel % loopW) + loopW) % loopW;
    darkEl.style.transform = `translate3d(${x}px,0,0)`;
  }, [scrollY, loopW, reduceMotion]);

  /**
   * 横方向のループ分をはみ出させるので overflow-hidden は必要だが、それは縦も切ってしまう。
   * 図形はベースラインより下へ出る（InlineMark の nudge）ため、その分の余白を縦に確保して
   * 文字と図形の下端が切れないようにしている。padding が高さに乗るので clip されない。
   * 余白は文字サイズ基準にしたいので、textClass をこの要素にも当てて em を成立させる。
   */
  return (
    <div
      className={`pointer-events-none w-full overflow-hidden py-[0.3em] leading-none ${textClass}`}
    >
      <div
        ref={darkTrackRef}
        className="flex w-max will-change-transform [backface-visibility:hidden]"
      >
        <WorkBelowMarqueeStrip textClass={textClass} />
        <WorkBelowMarqueeStrip textClass={textClass} ariaHidden />
      </div>
    </div>
  );
}

/** 写真枠内の下中央：下方向スクロールを示す矢印（白＋影で写真上でも視認できる）。onPaper は SP 等・背景が明るいとき用 */
function HeroScrollHint({
  visible,
  reduceMotion,
  variant = "onPhoto",
}: {
  visible: boolean;
  reduceMotion: boolean;
  variant?: "onPhoto" | "onPaper";
}) {
  const animate =
    visible && !reduceMotion
      ? "motion-reduce:animate-none animate-scroll-hint-bounce"
      : "motion-reduce:animate-none";

  const toneClass =
    variant === "onPhoto"
      ? "text-white [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.55))]"
      : "text-[#546e7a] [filter:drop-shadow(0_1px_0_rgba(255,255,255,0.6))]";

  return (
    <div
      className={`pointer-events-none flex flex-col items-center transition-opacity duration-500 ease-out motion-reduce:transition-none ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!visible}
    >
      {visible ? (
        <span className="sr-only">下へスクロールして続きを表示</span>
      ) : null}
      <div className={`flex flex-col items-center ${toneClass} ${animate}`}>
        <svg width="24" height="12" viewBox="0 0 24 12" className="block" aria-hidden="true">
          <path
            d="M3 3 L12 9 L21 3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg
          width="24"
          height="12"
          viewBox="0 0 24 12"
          className="-mt-1 block opacity-70"
          aria-hidden="true"
        >
          <path
            d="M3 3 L12 9 L21 3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

/**
 * FV の見出し 1 行。単語の間に画像を 1 枚挟む。
 * スクロール中（アニメーション）と静止時で同じ見た目にしたいので、両方からこれを呼ぶ。
 * 縦位置は top で決め、transform は呼び出し側が渡す（アニメーション側は translateY を足す）。
 *
 * settle は 0（定位置の外・ぼやけている）〜1（定位置・くっきり）。
 * ヒーローのスクロール進捗と同じ値を渡すことで、中央へ寄ってくる動きに合わせて
 * ぼかしが晴れていく。CSS アニメーションではなくスクロール連動なので、途中で
 * 止めればその状態で留まる。
 */
function FvHeadline({
  side,
  zClass,
  transform,
  settle,
}: {
  side: "left" | "right";
  zClass: string;
  transform: string;
  settle: number;
}) {
  const isLeft = side === "left";
  const t = clamp(settle, 0, 1);
  const blurPx = (1 - t) * FV_SETTLE_BLUR_PX;
  const { words, marks } = FV_LINES[isLeft ? 0 : 1];

  return (
    // 文字サイズはこのコンテナに置く。InlineMark が em で自分のサイズを決めるため、
    // 子要素側に text-[...] を置くと図形の基準が body の 16px になってしまう。
    // max-w は付けない。片側だけを固定した absolute なので、折り返さない 1 行が
    // そのまま反対側へ伸びて画面中央を越える。溢れは祖先の overflow-hidden が受け止める。
    <div
      className={`pointer-events-none absolute flex flex-nowrap items-baseline ${zClass} ${
        isLeft
          ? "left-[calc(clamp(1rem,5vw,2.5rem)-2.5rem)]"
          : "right-[calc(clamp(1rem,5vw,2.5rem)-2.5rem)] justify-end text-right"
      }`}
      style={{
        fontSize: FV_FONT_SIZE,
        gap: BRAND_GAP,
        top: `calc(50% ${isLeft ? "-" : "+"} ${FV_LINE_OFFSET})`,
        transform,
        filter: blurPx > 0.05 ? `blur(${blurPx.toFixed(2)}px)` : undefined,
        opacity: t < 1 ? 0.25 + 0.75 * t : undefined,
      }}
    >
      {/* 単語 → 図形 → 単語 → 図形 → 単語。すべての単語間に 1 枚入る */}
      {words.map((w, i) => (
        <Fragment key={w}>
          <p className={`m-0 ${BRAND_TEXT}`}>{w}</p>
          {marks[i] ? (
            <InlineMark src={marks[i]} spin={marks[i] === SPINNING_MARK} />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}

function TrioAtRest({
  scrollHintVisible,
  reduceMotion,
}: {
  scrollHintVisible: boolean;
  reduceMotion: boolean;
}) {
  return (
    <div className="relative z-[3] flex min-h-0 w-full flex-1 items-center justify-center">
      <div className="pointer-events-none absolute inset-x-0 bottom-10 z-[25] flex justify-center">
        <HeroScrollHint
          visible={scrollHintVisible}
          reduceMotion={reduceMotion}
          variant="onPaper"
        />
      </div>
      {/* 静止状態なので settle は 1（ぼかしなし） */}
      <FvHeadline side="left" zClass="z-[3]" transform="translateY(-50%)" settle={1} />
      <FvHeadline side="right" zClass="z-[3]" transform="translateY(-50%)" settle={1} />
    </div>
  );
}

/** 左見出しのみ sticky（SP では追従しない）。外側を sticky で包まない（包むと親高＝本文高になり下まで届かない） */
function AboutGrid() {
  return (
    <>
      <div className="col-span-12 self-start md:sticky md:top-24 z-10 md:col-span-4">
        <div
          className="flex flex-nowrap items-baseline pb-2 text-[40px] leading-none"
          style={{ gap: BRAND_GAP }}
        >
          <span className={BRAND_TEXT}>ABOUT</span>
          <InlineMark src={MARK_IMAGES[2]} />
          <span className={BRAND_TEXT}>ME</span>
        </div>
      </div>
      <div className="col-span-12 flex min-w-0 flex-col gap-10 pb-0 md:pb-16 md:col-span-6 md:col-start-7">
        <div className="flex flex-col gap-6 text-[#333]">
          <p className="w-full font-jp md:text-[16px] text-[14px] font-medium md:leading-[1.8] leading-[2] tracking-[0.08em]">
            東京を拠点にするウェブデザイナーです。エンジニア主体の開発会社で仕事をしながら、ビジュアルを描くことと、その手前の要件を整えること、その両方を自然に行き来するようなプロセスを大切にしています。良いデジタル体験は、見た目だけでなく「どう作られているか」という思慮深い構造から生まれると考えています。プロジェクトを俯瞰して捉え、デザインとその裏側にあるデータを、シンプルで誠実な方法でつなぐプロセスを大切にしています。
          </p>
          <p className="w-full font-sans text-[14px] leading-[1.8] md:leading-[1.5] tracking-[0.08em]">
            I am a web designer based in Tokyo. Working within an engineer-driven environment, I
            naturally move between visual craft and organizing the requirements behind it. I
            believe that a good digital experience comes from a thoughtful structure—not just how
            it looks, but how it is built. I enjoy looking at a project as a whole, finding a
            simple and honest way to connect design with the data underneath.

          </p>
        </div>
      </div>
    </>
  );
}

export default function Top() {
  const heroScrollRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [heroBox, setHeroBox] = useState({ top: 0, h: 0 });
  const [vh, setVh] = useState(() =>
    typeof window !== "undefined" ? window.innerHeight : 800,
  );
  const workRef = useRef<HTMLElement | null>(null);
  const [workReveal, setWorkReveal] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(prefersReducedMotion);
  /**
   * `photo` は中央写真を廃止した後も「名前の入場アニメが終わったか」のフラグとして残している。
   * これを起点に scroll 誘導とヘッダーの表示タイミングを決めているため、名前だけ歴史的なもの。
   */
  const [fvReveal, setFvReveal] = useState(() => ({
    photo: prefersReducedMotion(),
    header: prefersReducedMotion(),
  }));
  const titleIntroDoneRef = useRef(false);

  const onTitleIntroComplete = useCallback(() => {
    if (titleIntroDoneRef.current) return;
    titleIntroDoneRef.current = true;
    setFvReveal((v) => (v.photo ? v : { ...v, photo: true }));
  }, []);

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      const r = mq.matches;
      setReduceMotion(r);
      if (r) setFvReveal({ photo: true, header: true });
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /** 名前の入場のあと写真→少し遅れてヘッダー */
  useEffect(() => {
    if (!fvReveal.photo || fvReveal.header) return;
    const t = window.setTimeout(() => {
      setFvReveal((v) => ({ ...v, header: true }));
    }, 520);
    return () => clearTimeout(t);
  }, [fvReveal.photo, fvReveal.header]);

  const measureHero = () => {
    const el = heroScrollRef.current;
    if (!el) return;
    setHeroBox({ top: el.offsetTop, h: el.offsetHeight });
  };

  useLayoutEffect(() => {
    measureHero();
  }, []);

  /** ABOUT の下に WORK が続く前提で、ビューポートに入ったタイミングで「せり上がり」表示 */
  useLayoutEffect(() => {
    const el = workRef.current;
    if (!el || typeof window === "undefined") return;
    const revealIfVisible = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) setWorkReveal(true);
    };
    revealIfVisible();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setWorkReveal(true);
        }
      },
      { threshold: 0.06 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const viewport = window.innerHeight;
      setScrollY(y);

      const el = heroScrollRef.current;
      if (el) {
        const top = el.offsetTop;
        const h = el.offsetHeight;
        const scrollable = Math.max(1, h - viewport);
        const p = (y - top) / scrollable;
        setProgress(clamp(p, 0, 1));
        setHeroBox({ top, h });
      }
    };
    const onResize = () => {
      measureHero();
      onScroll();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /**
   * 中央写真を廃止したので、左行→右行の 2 段だけ。
   * 旧 P_IMG_END(0.18) 分の助走をそのまま左行の開始位置として残している。
   */
  const phases = useMemo(() => {
    const P_LEFT_START = 0.18;
    const P_LEFT_END = 0.38;
    const P_RIGHT_START = 0.38;
    const P_RIGHT_END = 0.58;

    const leftT = smoothstep(invLerp(P_LEFT_START, P_LEFT_END, progress));
    const rightT = smoothstep(invLerp(P_RIGHT_START, P_RIGHT_END, progress));

    const leftY = (1 - leftT) * -vh;
    const rightY = (1 - rightT) * vh;

    // leftT / rightT はそのまま FvHeadline の settle（ぼかしの晴れ具合）に渡す
    return { leftY, rightY, leftT, rightT };
  }, [progress, vh]);

  const titleShrink = useMemo(
    () => smoothstep(invLerp(0, P_TITLE_SHRINK_END, progress)),
    [progress],
  );

  const scrolledPastHero =
    heroBox.h > 0 && scrollY >= heroBox.top + heroBox.h - vh - 1;
  /** ヒーロー外では常に縮小状態を維持（ヘッダー複製は使わない） */
  const persistentTitleShrink = scrolledPastHero ? 1 : titleShrink;
  /** 3要素が揃ったあと〜ヒーロー用スクロールが終わるまで、画面奥に固定（その上を ABOUT が流れる） */
  const showFixedHeroLayer = progress >= P_TRIO_DONE && !scrolledPastHero;
  const showAnimatedSticky = progress < P_TRIO_DONE;

  const showHeroScrollHint = useMemo(() => {
    if (!fvReveal.photo || scrolledPastHero) return false;
    if (heroBox.h <= 0) return true;
    const yInHero = scrollY - heroBox.top;
    const threshold = Math.min(vh * 0.55, HERO_SCROLL_HINT_MAX_OFFSET);
    return yInHero < threshold;
  }, [fvReveal.photo, scrolledPastHero, heroBox.h, heroBox.top, scrollY, vh]);

  return (
    <div
      className="relative mx-auto flex min-h-screen w-full flex-col items-start bg-[#f5f7f8]"
      data-name="Top"
      style={overlapStyle}
    >
      <div className="pointer-events-none fixed inset-0 z-[40] [&_*]:pointer-events-none">
        <HeroTitleBlock
          shrink={persistentTitleShrink}
          reduceMotion={reduceMotion}
          onTitleIntroComplete={onTitleIntroComplete}
        />
      </div>

      <section
        ref={heroScrollRef}
        id="top"
        className="relative z-0 h-[min(450vh,4200px)] w-full shrink-0"
        aria-label="トップ"
      >
        {showAnimatedSticky && (
          <div className="sticky top-0 z-0 flex h-screen w-full flex-col overflow-hidden bg-[#f5f7f8]">
            <div className="relative flex min-h-0 flex-1 flex-col p-10 pt-24">
              <div className="relative z-20 flex min-h-0 w-full flex-1 items-center justify-center">
                <div className="pointer-events-none absolute inset-x-0 bottom-10 z-[24] flex justify-center">
                  <HeroScrollHint
                    visible={showHeroScrollHint}
                    reduceMotion={reduceMotion}
                    variant="onPaper"
                  />
                </div>
                <FvHeadline
                  side="left"
                  zClass="z-[23]"
                  transform={`translateY(calc(-50% + ${phases.leftY}px))`}
                  settle={reduceMotion ? 1 : phases.leftT}
                />
                <FvHeadline
                  side="right"
                  zClass="z-[23]"
                  transform={`translateY(calc(-50% + ${phases.rightY}px))`}
                  settle={reduceMotion ? 1 : phases.rightT}
                />
              </div>
            </div>
          </div>
        )}

        {showFixedHeroLayer && (
          <div className="pointer-events-none fixed inset-0 z-[1] flex h-screen w-full flex-col overflow-hidden bg-[#f5f7f8]">
            <div className="relative flex min-h-0 flex-1 flex-col p-10 pt-24">
              <TrioAtRest
                scrollHintVisible={showHeroScrollHint}
                reduceMotion={reduceMotion}
              />
            </div>
          </div>
        )}
      </section>

      {/**
       * ヒーローに対するせり上がりはこのラッパーの -mt のみ。
       * ABOUT と WORK の間は重ねない（ABOUT を最後までスクロールしてから WORK が続く）。
       * WORK の「せり上がり」は見出しブロックの入場アニメ（IntersectionObserver）。
       */}
      <div
        className="relative isolate z-10 flex w-full shrink-0 flex-col -mt-[var(--section-overlap)]"
        data-name="about-work-stack"
      >
        <section
          id="about"
          className="relative z-[1] w-full shrink-0 border-t border-[#b0bec5] bg-[#f5f7f8]"
          aria-label="About"
        >
          <div className="px-6 pb-10 pt-16 md:px-10 md:pb-20 md:pt-[120px]">
            <div className="grid w-full grid-cols-12 gap-x-6 gap-y-10 md:gap-x-10">
              <AboutGrid />
            </div>
          </div>
        </section>

        <section
          ref={workRef}
          id="work"
          className="relative z-[2] w-full shrink-0 border-t border-[#b0bec5] bg-[#f5f7f8] px-6 pt-16 pb-10 md:px-10 md:pb-20 md:pt-[120px]"
        >
          <div
            className={`grid w-full grid-cols-12 gap-x-6 gap-y-10 transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100 md:gap-x-10 ${
              workReveal ? "translate-y-0 opacity-100" : "translate-y-14 opacity-0"
            }`}
          >
            <div className="col-span-12 self-start md:sticky md:top-24 z-10 md:col-span-4">
              <div
                className="flex flex-nowrap items-baseline pb-2 text-[40px] leading-none"
                style={{ gap: BRAND_GAP }}
              >
                <span className={BRAND_TEXT}>RECENT</span>
                <InlineMark src={MARK_IMAGES[3]} />
                <span className={BRAND_TEXT}>WORK</span>
              </div>
            </div>
            <div className="col-span-12 min-w-0 md:col-span-6 md:col-start-7">
              <ul className="flex flex-col">
                {workItems.map((item) => (
                  <li key={item.id}>
                    <WorkRoleRow item={item} />
                  </li>
                ))}
                <li className="h-px w-full bg-[#b0bec5]" />
              </ul>
            </div>
          </div>
        </section>
      </div>

      <section
        className="relative z-10 w-full shrink-0 bg-[#f5f7f8]"
        aria-label="Statement"
      >
        {/* 中央の写真を廃止したので、帯だけを全幅で流す。上下セクションとの間はここで空ける */}
        <div className="w-full py-28 md:py-40">
          <WorkBelowStatementMarquee
            textClass="text-[clamp(36px,7vw,80px)]"
            scrollY={scrollY}
          />
        </div>
      </section>

      <section
        id="contact"
        className="relative z-10 flex w-full items-start justify-between overflow-hidden bg-[#f5f7f8] px-6 md:px-10"
      >
        <div className="w-full py-16 md:py-24">
          <Link
            to="/contact"
            className="group flex w-full flex-wrap items-center gap-8 motion-reduce:transition-none md:gap-16 md:flex-nowrap"
            aria-label="お問い合わせフォームへ"
          >
            {/*
              CTA は右の丸ボタンと並ぶため幅が足りず折り返す。
              図形は「後続の単語」と同じ塊に入れておくと、折り返しても図形だけが行末に
              取り残されない（改行は図形の前で起きる）。
            */}
            <div
              className="flex min-w-0 flex-1 flex-wrap items-baseline text-[clamp(40px,11vw,128px)] leading-none md:text-[128px]"
              style={{ gap: BRAND_GAP }}
            >
              <GetInTouchHeadlineWord textClassName={BRAND_TEXT}>GET</GetInTouchHeadlineWord>
              <span className="inline-flex flex-nowrap items-baseline" style={{ gap: BRAND_GAP }}>
                <InlineMark src={MARK_IMAGES[0]} />
                <GetInTouchHeadlineWord textClassName={BRAND_TEXT}>IN</GetInTouchHeadlineWord>
              </span>
              <span className="inline-flex flex-nowrap items-baseline" style={{ gap: BRAND_GAP }}>
                <InlineMark src={MARK_IMAGES[1]} />
                <GetInTouchHeadlineWord textClassName={BRAND_TEXT}>TOUCH</GetInTouchHeadlineWord>
              </span>
            </div>
            <span className="flex size-[min(240px,72vw)] shrink-0 items-center justify-center rounded-full border border-black text-[#333] transition-colors duration-200 ease-out group-hover:bg-[#333] group-hover:text-white motion-reduce:transition-none md:size-[240px]">
              <CtaArrow />
            </span>
          </Link>
        </div>
      </section>

      <SiteFooter />

      <SiteHeader revealNav={fvReveal.header} />
    </div>
  );
}
