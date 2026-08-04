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
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  BRAND_COLORS,
  BRAND_GAP,
  BRAND_TEXT,
  HoverRevealWord,
  InlineMark,
  MARK_EYES_OVERLAY,
  MARK_IMAGE_EYES,
  MARK_IMAGES,
  SCROLL_HINT_MARK,
} from "./components/brand";
import { RoleList } from "./components/RoleList";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { hasWorkDetail } from "./data/workDetails";
import { workItems, type WorkItem } from "./data/workItems";

/** カーソル（またはフォーカス基準点）からツールチップ左上へのずらし — カーソルと文字が重ならないようにする */
const WORK_ROLE_CURSOR_OFFSET = { x: 14, y: 14 };

/**
 * GET IN TOUCH のホバーで出てくる白抜き文字の縁取り幅。
 * -webkit-text-stroke は既定では文字の輪郭中心に描かれるため、太くするほど字面が痩せる。
 * 128px の太ゴシックに対して 1px はかなり細いので、輪郭を強めたいならここを上げる。
 */
const CTA_TEXT_STROKE_WIDTH = "1.5px";
/** CTA の大きな丸の中に置く小さな丸の直径（丸の幅に対する割合） */
const CTA_DOT_RATIO = "12%";

/** ROLE ツールチップを画面端からどれだけ内側で止めるか */
const WORK_ROLE_VIEWPORT_MARGIN = 12;

/** CTA の見出し 1 語。ホバーで白抜き＋縁取りの同じ語がせり上がる */
function GetInTouchHeadlineWord({
  children,
  textClassName,
}: {
  children: ReactNode;
  textClassName: string;
}) {
  return (
    <HoverRevealWord
      textClassName={textClassName}
      // 色は inline style で当てる。Tailwind の text-[#333] と text-white は
      // どちらも同じ詳細度の color ユーティリティで、生成 CSS の順序次第で負けることがあるため。
      revealStyle={{ color: "#fff", WebkitTextStroke: `${CTA_TEXT_STROKE_WIDTH} #333` }}
    >
      {children}
    </HoverRevealWord>
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

/**
 * smoothstep より両端が平ら・中央が急な曲線（6t^5-15t^4+10t^3）。
 * スクロール連動のままでも「ゆっくり動き出す → 一気に寄る → すっと止まる」と
 * 緩急がつき、等速に近い smoothstep より表情が出る。
 */
function smootherstep(t: number) {
  const c = clamp(t, 0, 1);
  return c * c * c * (c * (c * 6 - 15) + 10);
}

/** セクション間の重なり量（ヒーロー←ABOUT、ABOUT←WORK で共通。1 箇所で調整） */
const overlapStyle = {
  ["--section-overlap" as string]: "min(100svh, 56rem)",
} as CSSProperties;

/** 右コピー完了 ≒ 2 行が定位置に揃ったタイミング（phases の右行終端と一致させること） */
const P_TRIO_DONE = 0.7;
/** 0〜1 でヒーロー見出しが大→小＆上へ。終端は P_TRIO_DONE より手前に置く */
const P_TITLE_SHRINK_END = 0.48;

/** ファーストビュー：名前の一文字ずつ出現（delay の間隔・語間） */
const HERO_INTRO_CHAR_STAGGER_MS = 68;
const HERO_INTRO_WORD_GAP_MS = 180;
/** ヒーロー内でこれ以上スクロールしたら scroll 誘導を消す（ヒーロー先頭からの距離） */
const HERO_SCROLL_HINT_MAX_OFFSET = 480;
/**
 * FV 見出しの文字サイズ。画像もこのサイズ基準（em）で決まるので、ここを変えれば
 * 文字と画像がまとめて追従する。
 *
 * md 以上（--fv-size 未設定）は 8vw が主役。画面幅に比例させることで、どの幅でも
 * 占有率がほぼ一定（右行で約 78%）になる。min(..., 22vh) は縦が浅いウィンドウで
 * 2 行がはみ出すのを防ぐ保険、148px は超ワイドでの頭打ち。
 * SP は下の FV_SP_CLASS が --fv-size を上書きして一段大きくする（塊で改行するので入る）。
 */
const FV_FONT_SIZE = "clamp(26px, var(--fv-size, min(8vw, 22vh)), 148px)";
/**
 * SP だけ効かせる 3 つの上書き。
 * - --fv-size: 塊ごとに改行するぶん文字を大きくできる。72px の頭打ちは md 直下
 *   （767px 付近）で 13vw が md の 8vw を大きく上回り、ブレークポイントで
 *   サイズが跳ねるのを抑えるため
 * - --fv-lift: キャッチ全体を画面中央から持ち上げる量（ロゴは中央のまま）
 * - --fv-gap: 2 つの塊のあいだの余白。SP は 2 行 × 2 塊で 4 行になり、
 *   狭いと 1 つの段落に見えるので md より広く取る
 *
 * Tailwind は生成前のソース文字列を走査するので、**値はここに直接書く**こと
 * （変数を埋め込むとクラスが生成されない）。md 以上は initial に戻し、
 * --fv-size と --fv-gap は参照側の fallback、--fv-lift は 0 として扱われる。
 */
const FV_SP_CLASS =
  "[--fv-size:min(13vw,72px)] [--fv-lift:2vh] [--fv-gap:0.3em] md:[--fv-size:initial] md:[--fv-lift:0px] md:[--fv-gap:initial]";
/**
 * 2 つの塊を画面中央からどれだけ離すか（md 以上の既定値。SP は --fv-gap が上書きする）。
 * 左の塊は下端が「中央 − これ」、右の塊は上端が「中央 ＋ これ」に来る。
 * 上下を bottom / top で対称に取るので、SP で塊が複数行になっても行数の計算が要らない。
 */
const FV_LINE_GAP = "var(--fv-gap, 0.06em)";
/**
 * SP でどの単語の**直後**で改行するか（0 起点。図形は単語の後ろに付く）。
 * `[0]` = `DRIVEN●` / `by●LOGIC,` の 2 行。`by` は繋ぎ語なので後続の語と同じ行に置く。
 * `[0, 1]` にすると図形ごとに切れて 3 行になるが、`by` だけの行ができて文が等分に割れる。
 * md 以上では常に 1 行なので影響しない。
 */
const FV_SP_ROW_BREAK_AFTER = [0];
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
  // 黄色だけ FV では目玉あり版を使う。見出しやマルキーでは目玉なしの MARK_IMAGES[3]
  { words: ["DEFINED", "by", "DESIGN."], marks: [MARK_IMAGES[2], MARK_IMAGE_EYES] },
];
/**
 * ゆっくり回し続ける図形。ロゴの図形と同じ fv_2.svg（青い星型）を回す。
 * 星型は回転が素直に読める形なので、他の図形と違って動かしても崩れない。
 * FV のキャッチでは「左行の 2 つ目」がこれに当たる。
 */
const SPINNING_MARK = MARK_IMAGES[1];

/**
 * 一度だけ「画面に入った」ことを検知する。ABOUT / WORK の出現アニメーションの起点。
 * IntersectionObserver は交差の *変化* しか通知しないため、初期表示ですでに
 * 見えている場合を先に拾っておく（リロード位置によっては永久に出てこなくなる）。
 */
function useRevealOnce<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [revealed, setRevealed] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      setRevealed(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setRevealed(true);
      },
      { threshold: 0.06 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, revealed] as const;
}

/** 下からすっと上がってくる出現。reduced-motion では最終状態のまま出す */
const REVEAL_TRANSITION =
  "transition-[opacity,transform] duration-[800ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100";

function revealClass(revealed: boolean) {
  return `${REVEAL_TRANSITION} ${revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`;
}

/** 順番に少しずつ遅らせる。1 項目あたりの間隔 */
const REVEAL_STAGGER_MS = 90;

function revealDelay(index: number, revealed: boolean): CSSProperties {
  // 消えるときまで遅延すると閉じ際がもたつくので、出るときだけ遅らせる
  return { transitionDelay: revealed ? `${index * REVEAL_STAGGER_MS}ms` : "0ms" };
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function WorkRoleRow({ item }: { item: WorkItem }) {
  const rowRef = useRef<HTMLDivElement | HTMLAnchorElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  /** ビューポート基準の座標（ツールチップを body 直下に fixed で出すため） */
  const [tipPos, setTipPos] = useState({ x: 0, y: 0 });
  const [tipSize, setTipSize] = useState({ w: 240, h: 120 });
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  /** 行に入るたびに増やしてツールチップを差し替え、入場アニメを毎回再生する */
  const [tipBurst, setTipBurst] = useState(0);
  const visible = hover || focused;
  const hasDetailPage = hasWorkDetail(item.id);

  /**
   * 画面端でツールチップがはみ出さないよう寸法を持っておく。
   * 表示に切り替わった時だけ測る（マウス移動のたびに測るとレイアウトが毎回走って重い）。
   * 入場アニメに scale が含まれるので、transform の影響を受けない offset* を使う。
   */
  useLayoutEffect(() => {
    if (!visible) return;
    const el = tipRef.current;
    if (!el) return;
    setTipSize({ w: el.offsetWidth, h: el.offsetHeight });
  }, [visible, tipBurst]);

  const syncPosFromMouse = (e: MouseEvent<HTMLElement>) => {
    setTipPos({ x: e.clientX, y: e.clientY });
  };

  /** キーボードフォーカス時はカーソルが無いので、行の中ほどを基準にする */
  const placeTipCentered = () => {
    const el = rowRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setTipPos({ x: r.left + r.width * 0.4, y: r.top + r.height / 2 });
  };

  /** カーソル位置から実際の表示位置へ。画面内に収まるよう端で止める */
  const tipLeft = clamp(
    tipPos.x + WORK_ROLE_CURSOR_OFFSET.x,
    WORK_ROLE_VIEWPORT_MARGIN,
    Math.max(
      WORK_ROLE_VIEWPORT_MARGIN,
      window.innerWidth - tipSize.w - WORK_ROLE_VIEWPORT_MARGIN,
    ),
  );
  const tipTop = clamp(
    tipPos.y + WORK_ROLE_CURSOR_OFFSET.y,
    WORK_ROLE_VIEWPORT_MARGIN,
    Math.max(
      WORK_ROLE_VIEWPORT_MARGIN,
      window.innerHeight - tipSize.h - WORK_ROLE_VIEWPORT_MARGIN,
    ),
  );

  const rowClassName =
    "relative flex h-24 md:h-24 items-center justify-between gap-4 px-4 transition-colors duration-200 ease-out hover:bg-[#eceff1] focus-visible:bg-[#eceff1] focus-visible:outline-none motion-reduce:transition-none " +
    (hasDetailPage ? "cursor-pointer" : "cursor-default");

  const rowBody = (
    <>
      <p className="min-w-0 flex-1 font-sans md:text-[16px] text-[15px] leading-[1.8] tracking-[0.08em] text-[#333]">
        {item.title}
      </p>
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

  /**
   * ツールチップは body 直下に fixed で出す。
   * 行の中に置くと、祖先の `about-work-stack`（isolation: isolate）が作る
   * スタッキングコンテキストから出られず、後続の Statement / contact セクション
   * （同じ z-10・不透明背景）に上から塗り潰されて、セクション外にはみ出した部分が消える。
   * body 直下なら祖先の重なり順にも overflow にも影響されない。
   */
  const tooltip = createPortal(
    <div
      className="pointer-events-none fixed left-0 top-0 z-[60]"
      style={{ transform: `translate(${tipLeft}px, ${tipTop}px)` }}
    >
      <div
        ref={tipRef}
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
        <RoleList
          roles={item.roles}
          className={`font-sans text-[13px] leading-[1.5] tracking-[0.04em] text-[#333] ${
            visible ? "motion-reduce:animate-none animate-work-role-text-in" : ""
          }`}
        />
      </div>
    </div>,
    document.body,
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
      {tooltip}
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

  /**
   * 縮小完了時の上端オフセットと文字サイズ。**幅にかかわらず SiteCenterBrand と同じ値**
   * にしておくこと。ここがずれると、トップの縮小後ロゴだけがヘッダーのナビ・
   * ハンバーガーと縦位置が合わなくなる（サブページは SiteCenterBrand なので合う）。
   */
  const topMin = 28;
  const shrunkFontPx = 32;
  const fontPx = shrunkFontPx + ((mdUp ? 160 : 54) - shrunkFontPx) * (1 - shrink);
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
   * shrink=0 で画面中央、shrink=1 で上寄せ（行の上端が topMin）。その間を線形に補間する。
   * SP でもロゴは中央から始める（上へ寄せるのはキャッチ側 = FV_SP_LIFT）。
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
          {/*
            ベースライン補正は既定値（InlineMark の 0.14em）のままでよい。包み要素を
            inline-flex にした時点で他の見出しと揃っている。
            注意: 入場アニメ heroCharIn の 0% は translateY(0.12em) なので、アニメが
            止まった状態で位置を測ると 0.12em 低く見える。補正値を足し引きする前に
            アニメを finish() させてから測ること。
          */}
          <InlineMark src={MARK_IMAGES[1]} spin />
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

/**
 * スクロール誘導の矢印の幅（高さは絵柄の比率で追従する）。
 * md 以上で大きくするのは、静止時のロゴが 160px あって 44px では負けてしまうため。
 */
const SCROLL_HINT_WIDTH_CLASS = "w-11 md:w-16";
/**
 * 2 枚目を上に詰める量。fv_5.svg は正方形の viewBox の下寄りに絵柄があり、
 * 上に幅の約 3 割の余白を持っているため、素直に縦に並べると離れて見える。
 * 幅を変えたらここも比例させること（幅の 1/4 強が目安）。
 */
const SCROLL_HINT_STACK_CLASS = "-mt-2.5 md:-mt-3.5";

/**
 * ヒーロー下中央：下方向スクロールを示す矢印。図形はブランドの素材（fv_5.svg）を使う。
 * 縦に 2 枚重ねて下方向を強めている（2 枚目は薄くして奥行きを出す）。
 * 以前は細い山形 2 つの自前 SVG で、明るい背景でも見えるよう色と影を出し分けていたが、
 * ベタ塗りのピンクになったのでどちらも要らなくなった。
 */
function HeroScrollHint({
  visible,
  reduceMotion,
}: {
  visible: boolean;
  reduceMotion: boolean;
}) {
  const animate =
    visible && !reduceMotion
      ? "motion-reduce:animate-none animate-scroll-hint-bounce"
      : "motion-reduce:animate-none";

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
      {/* バウンスは 2 枚まとめて掛ける（別々に掛けると 2 枚の間隔が伸び縮みする） */}
      <div className={`flex flex-col items-center ${animate}`}>
        <img
          src={SCROLL_HINT_MARK}
          alt=""
          aria-hidden="true"
          className={`block h-auto ${SCROLL_HINT_WIDTH_CLASS}`}
        />
        <img
          src={SCROLL_HINT_MARK}
          alt=""
          aria-hidden="true"
          className={`block h-auto opacity-70 ${SCROLL_HINT_WIDTH_CLASS} ${SCROLL_HINT_STACK_CLASS}`}
        />
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
  /**
   * SP の行分け。単語インデックスの配列の配列。
   * md 以上ではコンテナが flex-row になるので、この塊がそのまま横に並んで 1 行に戻る。
   */
  const spRows = words.reduce<number[][]>((rows, _w, i) => {
    rows[rows.length - 1].push(i);
    if (FV_SP_ROW_BREAK_AFTER.includes(i) && i < words.length - 1) rows.push([]);
    return rows;
  }, [[]]);

  return (
    // 文字サイズはこのコンテナに置く。InlineMark が em で自分のサイズを決めるため、
    // 子要素側に text-[...] を置くと図形の基準が body の 16px になってしまう。
    // max-w は付けない。片側だけを固定した absolute なので、折り返さない 1 行が
    // そのまま反対側へ伸びて画面中央を越える。溢れは祖先の overflow-hidden が受け止める。
    <div
      /*
        SP は塊を縦に積み、左の塊は左寄せ・右の塊は右寄せ。md 以上は flex-row に戻して
        塊が横に並ぶので、見た目は従来どおりの 1 行になる（gap は語間と同じ値）。
        縦位置は左が bottom・右が top で中央から対称に取るため、行数が増えても計算が要らない。
        --fv-lift / --fv-size は SP だけの上書き（FV_SP_CLASS）。
      */
      className={`pointer-events-none absolute flex flex-col md:flex-row md:flex-nowrap md:items-baseline ${FV_SP_CLASS} ${zClass} ${
        isLeft
          ? "left-[calc(clamp(1rem,5vw,2.5rem)-2.5rem)] items-start"
          : "right-[calc(clamp(1rem,5vw,2.5rem)-2.5rem)] items-end justify-end text-right"
      }`}
      style={{
        fontSize: FV_FONT_SIZE,
        gap: BRAND_GAP,
        [isLeft ? "bottom" : "top"]: `calc(50% ${
          isLeft ? "+" : "-"
        } var(--fv-lift, 0px) + ${FV_LINE_GAP})`,
        transform,
        filter: blurPx > 0.05 ? `blur(${blurPx.toFixed(2)}px)` : undefined,
        opacity: t < 1 ? 0.25 + 0.75 * t : undefined,
      }}
    >
      {/* 単語 → 図形 → 単語 → 図形 → 単語。すべての単語間に 1 枚入る */}
      {spRows.map((row) => (
        <div
          key={row.join("-")}
          className="flex flex-nowrap items-baseline"
          style={{ gap: BRAND_GAP }}
        >
          {row.map((i) => (
            <Fragment key={words[i]}>
              <p className={`m-0 ${BRAND_TEXT}`}>{words[i]}</p>
              {marks[i] ? (
                <InlineMark
                  src={marks[i]}
                  spin={marks[i] === SPINNING_MARK}
                  // 青いギザギザ丸だけ、FV では目玉を重ねる（目玉は回らず土台だけ回る）
                  overlaySrc={marks[i] === SPINNING_MARK ? MARK_EYES_OVERLAY : undefined}
                />
              ) : null}
            </Fragment>
          ))}
        </div>
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
  // 見出しと本文は横並びなので、片方の交差を両方の起点にする
  const [revealRef, revealed] = useRevealOnce<HTMLDivElement>();

  return (
    <>
      <div
        ref={revealRef}
        className="col-span-12 self-start md:sticky md:top-24 z-10 md:col-span-4"
      >
        <div
          className={`flex flex-nowrap items-baseline pb-2 text-[40px] leading-none ${revealClass(revealed)}`}
          style={{ gap: BRAND_GAP, ...revealDelay(0, revealed) }}
        >
          <span className={BRAND_TEXT}>ABOUT</span>
          <InlineMark src={MARK_IMAGES[2]} />
          <span className={BRAND_TEXT}>ME</span>
        </div>
      </div>
      <div className="col-span-12 flex min-w-0 flex-col gap-10 pb-0 md:pb-16 md:col-span-6 md:col-start-7">
        <div className="flex flex-col gap-6 text-[#333]">
          <p
            className={`w-full font-jp md:text-[16px] text-[14px] font-medium md:leading-[1.8] leading-[2] tracking-[0.08em] ${revealClass(revealed)}`}
            style={revealDelay(1, revealed)}
          >
            東京を拠点にするウェブデザイナーです。エンジニア主体の開発会社で仕事をしながら、ビジュアルを描くことと、その手前の要件を整えること、その両方を自然に行き来するようなプロセスを大切にしています。良いデジタル体験は、見た目だけでなく「どう作られているか」という思慮深い構造から生まれると考えています。プロジェクトを俯瞰して捉え、デザインとその裏側にあるデータを、シンプルで誠実な方法でつなぐプロセスを大切にしています。
          </p>
          <p
            className={`w-full font-sans text-[14px] leading-[1.8] md:leading-[1.5] tracking-[0.08em] ${revealClass(revealed)}`}
            style={revealDelay(2, revealed)}
          >
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
  const [workRef, workReveal] = useRevealOnce<HTMLElement>();
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
  /**
   * 各行が動く区間。以前は 0.2 ずつの短い区間を左→右と順番に消化していたため、
   * 少しスクロールしただけで一気に終わってしまい味気なかった。
   * 区間を広げてゆっくりにし、さらに左右を重ねて（0.34〜0.46 が重複）
   * 「左が着く前に右が動き出す」流れにしている。
   * 右行の終わりが P_TRIO_DONE と一致していないと、静止レイヤーに切り替わる瞬間に飛ぶ。
   */
  const phases = useMemo(() => {
    const P_LEFT_START = 0.12;
    const P_LEFT_END = 0.46;
    const P_RIGHT_START = 0.34;
    const P_RIGHT_END = P_TRIO_DONE;

    const leftT = smootherstep(invLerp(P_LEFT_START, P_LEFT_END, progress));
    const rightT = smootherstep(invLerp(P_RIGHT_START, P_RIGHT_END, progress));

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
          {/*
            以前はこのグリッド全体を一括で動かしていたが、見出しと行が同時に動くと
            ただ塊がずれるだけで表情が出ない。見出し → 各行の順に少しずつ遅らせる。
          */}
          <div className="grid w-full grid-cols-12 gap-x-6 gap-y-10 md:gap-x-10">
            <div className="col-span-12 self-start md:sticky md:top-24 z-10 md:col-span-4">
              <div
                className={`flex flex-nowrap items-baseline pb-2 text-[40px] leading-none ${revealClass(workReveal)}`}
                style={{ gap: BRAND_GAP, ...revealDelay(0, workReveal) }}
              >
                <span className={BRAND_TEXT}>RECENT</span>
                <InlineMark src={MARK_IMAGES[3]} />
                <span className={BRAND_TEXT}>WORK</span>
              </div>
            </div>
            <div className="col-span-12 min-w-0 md:col-span-6 md:col-start-7">
              <ul className="flex flex-col">
                {workItems.map((item, i) => (
                  <li
                    key={item.id}
                    className={revealClass(workReveal)}
                    style={revealDelay(i + 1, workReveal)}
                  >
                    <WorkRoleRow item={item} />
                  </li>
                ))}
                <li
                  className={`h-px w-full bg-[#b0bec5] ${revealClass(workReveal)}`}
                  style={revealDelay(workItems.length + 1, workReveal)}
                />
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
            /* 見出しと丸は SP でも横並び。行の折り返しは見出し側で作る */
            className="group flex w-full flex-row flex-nowrap items-center gap-6 motion-reduce:transition-none md:gap-16"
            aria-label="お問い合わせフォームへ"
          >
            {/*
              SP は幅が足りないので GET / IN / TOUCH を 1 語ずつ縦に積む（flex-col）。
              md 以上は従来どおり横並びで、入りきらなければ折り返す。
              図形は「直前の単語」と同じ塊に入れてあるので、どちらでも
              GET● / IN● / TOUCH の並びが崩れない（改行は塊の境目でしか起きない）。
            */}
            <div
              className="flex min-w-0 flex-1 flex-col items-start text-[clamp(40px,11vw,128px)] leading-none md:flex-row md:flex-wrap md:items-baseline md:text-[128px]"
              style={{ columnGap: BRAND_GAP, rowGap: "0.08em" }}
            >
              <span className="inline-flex flex-nowrap items-baseline" style={{ gap: BRAND_GAP }}>
                <GetInTouchHeadlineWord textClassName={BRAND_TEXT}>GET</GetInTouchHeadlineWord>
                {/* 文字のせり上がりと同じ 700ms・同じカーブで 90 度傾く */}
                <InlineMark src={MARK_IMAGES[0]} hoverRotate />
              </span>
              <span className="inline-flex flex-nowrap items-baseline" style={{ gap: BRAND_GAP }}>
                <GetInTouchHeadlineWord textClassName={BRAND_TEXT}>IN</GetInTouchHeadlineWord>
                <InlineMark src={MARK_IMAGES[1]} hoverRotate />
              </span>
              <GetInTouchHeadlineWord textClassName={BRAND_TEXT}>TOUCH</GetInTouchHeadlineWord>
            </div>
            {/* 横に見出しが並ぶので、SP では丸を文字幅を奪わない大きさに抑える */}
            <span className="flex size-[min(112px,30vw)] shrink-0 items-center justify-center rounded-full border border-black transition-colors duration-200 ease-out group-hover:bg-[#333] motion-reduce:transition-none md:size-[240px]">
              {/* 大きな丸の中の小さなカラーの丸。丸の大きさに追従させるため % 指定 */}
              <span
                className="block shrink-0 rounded-full"
                style={{
                  width: CTA_DOT_RATIO,
                  aspectRatio: "1 / 1",
                  backgroundColor: BRAND_COLORS.pink,
                }}
                aria-hidden="true"
              />
            </span>
          </Link>
        </div>
      </section>

      <SiteFooter />

      <SiteHeader revealNav={fvReveal.header} />
    </div>
  );
}
