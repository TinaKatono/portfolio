import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type RefObject,
} from "react";
import { Link } from "react-router-dom";
import pfImg2 from "./assets/pf_2.webp";
import { CtaArrow, SkewSerif } from "./components/brand";
import { SiteHeader } from "./components/SiteHeader";
import { hasWorkDetail } from "./data/workDetails";
import { workItems, type WorkItem } from "./data/workItems";

/** カーソル（またはフォーカス基準点）からツールチップ左上へのずらし — カーソルと文字が重ならないようにする */
const WORK_ROLE_CURSOR_OFFSET = { x: 14, y: 14 };

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

/** WORK 直下マルquee：黒／白の2層で同一の基準に置く（translateX(-50%) と 100vw の相性でズレやすいため margin 方式） */
const workBelowMarqueeBleedStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  marginLeft: "-50vw",
  width: "100vw",
  transform: "translateY(-50%)",
};

function MarqueeEllipse({ fill = "#F4511E" }: { fill?: string }) {
  return (
    <div
      className="flex size-[85px] shrink-0 items-center justify-center"
      aria-hidden="true"
    >
      <div className="-rotate-45">
        <svg width="72" height="48" viewBox="0 0 72 48" className="block">
          <ellipse cx="36" cy="24" rx="34" ry="20" fill={fill} />
        </svg>
      </div>
    </div>
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
    "relative flex h-24 items-center justify-between gap-4 px-4 transition-colors duration-200 ease-out hover:bg-[#eceff1] focus-visible:bg-[#eceff1] focus-visible:outline-none motion-reduce:transition-none " +
    (hasDetailPage ? "cursor-pointer" : "cursor-default");

  const rowBody = (
    <>
      <p className="min-w-0 flex-1 font-sans text-[16px] leading-[1.8] tracking-[0.08em] text-[#333]">
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
        <img
          src={item.thumbSrc}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
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

function HeroTitleBlock({ shrink }: { shrink: number }) {
  const topPx = 80 * (1 - shrink) + 28 * shrink;
  const fontPx = 32 + (160 - 32) * (1 - shrink);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-[2] flex w-full justify-center px-4"
      style={{ paddingTop: `${topPx}px` }}
    >
      <div
        className="inline-flex max-w-full flex-wrap items-center justify-center gap-4"
        style={{ fontSize: `${fontPx}px`, lineHeight: 1 }}
      >
        <p className="whitespace-nowrap text-center font-sans leading-none tracking-[-0.03em] pr-4 text-[#333]">
          TINA
        </p>
        <SkewSerif>
          <span className="whitespace-nowrap leading-none tracking-[0.02em] text-[#333]">KATONO</span>
        </SkewSerif>
      </div>
    </div>
  );
}

/** marquee 用ポートレート枠＋二重画像 */
function WorkBelowPortraitBlock() {
  return (
    <div className="h-[min(598px,70vh)] w-full overflow-hidden bg-[#eceff1]">
      <div className="relative h-full w-full">
        <img
          alt=""
          src={pfImg2}
          className="pointer-events-none absolute left-1/2 top-0 h-full w-[min(896px,220%)] max-w-none -translate-x-1/2 object-cover"
          decoding="async"
        />
        <img
          alt=""
          src={pfImg2}
          className="pointer-events-none absolute left-1/2 top-0 h-full w-[min(798px,195%)] max-w-none -translate-x-1/2 object-cover opacity-80"
          decoding="async"
        />
      </div>
    </div>
  );
}

/** WORK 直下：1コピー分（無限マルquee用に2つ並べる） */
function WorkBelowMarqueeStrip({
  textClass = "text-[clamp(28px,5.5vw,64px)]",
  phraseColorClass = "text-[#333]",
  ellipseFill = "#F4511E",
  toneClass = "",
  ariaHidden = false,
}: {
  textClass?: string;
  phraseColorClass?: string;
  ellipseFill?: string;
  /** 写真上レイヤー用 text-shadow（filter はレイヤーごとにずれやすい） */
  toneClass?: string;
  ariaHidden?: boolean;
}) {
  const sans = `whitespace-nowrap font-sans leading-none tracking-[-0.03em] ${phraseColorClass} ${textClass} ${toneClass}`.trim();
  const serifSkew =
    `whitespace-nowrap font-serif not-italic leading-none tracking-[0.02em] ${phraseColorClass} ${textClass} ${toneClass}`.trim();

  return (
    <div
      className="flex shrink-0 flex-nowrap items-center pr-12 md:pr-0"
      aria-hidden={ariaHidden || undefined}
    >
      <p className={sans}>DRIVEN BY </p>
      <div className="flex items-center justify-center pl-2 pr-2">
        <SkewSerif>
          <span className={serifSkew}>LOGIC,</span>
        </SkewSerif>
      </div>
      {/* <MarqueeEllipse fill={ellipseFill} /> */}
      <p className={sans}>DEFINED BY </p>
      <div className="flex items-center justify-center pl-2">
        <SkewSerif>
          <span className={serifSkew}>DESIGN.</span>
        </SkewSerif>
      </div>
      <MarqueeEllipse fill={ellipseFill} />
      <p className={sans}>DRIVEN BY </p>
      <div className="flex items-center justify-center pl-2 pr-2">
        <SkewSerif>
          <span className={serifSkew}>LOGIC,</span>
        </SkewSerif>
      </div>
      {/* <MarqueeEllipse fill={ellipseFill} /> */}
      <p className={sans}>DEFINED BY </p>
      <div className="flex items-center justify-center pl-2">
        <SkewSerif>
          <span className={serifSkew}>DESIGN.</span>
        </SkewSerif>
      </div>
      <MarqueeEllipse fill={ellipseFill} />
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
  const lightTrackRef = useRef<HTMLDivElement>(null);
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
    const lightEl = lightTrackRef.current;
    if (!darkEl || !lightEl) return;
    if (reduceMotion || loopW <= 0) {
      darkEl.style.transform = "translate3d(0,0,0)";
      lightEl.style.transform = "translate3d(0,0,0)";
      return;
    }
    const travel = scrollY * WORK_BELOW_STATEMENT_SCROLL_PX_PER_Y;
    const x = -((travel % loopW) + loopW) % loopW;
    const tx = `translate3d(${x}px,0,0)`;
    darkEl.style.transform = tx;
    lightEl.style.transform = tx;
  }, [scrollY, loopW, reduceMotion]);

  const darkProps = {
    textClass,
    phraseColorClass: "text-[#333]" as const,
    ellipseFill: "#F4511E",
  };
  const lightProps = {
    textClass,
    phraseColorClass: "text-white" as const,
    ellipseFill: "#ffffff",
    toneClass: "[text-shadow:0_1px_2px_rgba(0,0,0,0.45)]",
  };

  const trackClass =
    "flex w-max will-change-transform [backface-visibility:hidden]";

  return (
    <>
      <div
        className="pointer-events-none z-[2] overflow-hidden"
        style={workBelowMarqueeBleedStyle}
      >
        <div className="w-full overflow-hidden py-1">
          <div ref={darkTrackRef} className={trackClass}>
            <WorkBelowMarqueeStrip {...darkProps} />
            <WorkBelowMarqueeStrip {...darkProps} ariaHidden />
          </div>
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[3] overflow-hidden"
        aria-hidden
      >
        <div className="overflow-hidden py-1" style={workBelowMarqueeBleedStyle}>
          <div ref={lightTrackRef} className={trackClass}>
            <WorkBelowMarqueeStrip {...lightProps} />
            <WorkBelowMarqueeStrip {...lightProps} ariaHidden />
          </div>
        </div>
      </div>
    </>
  );
}

function TrioAtRest() {
  return (
    <div className="relative z-[3] flex min-h-0 w-full flex-1 items-center justify-center">
      <div
        className="pointer-events-none absolute z-[2] h-[min(598px,70vh)] w-[min(448px,90vw)] overflow-hidden bg-[#eceff1]"
        style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
        aria-hidden="true"
      >
        <img src={pfImg2} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="pointer-events-none absolute left-[calc(clamp(1rem,5vw,2.5rem)-2.5rem)] top-1/2 z-[3] flex max-w-[min(100%,28rem)] -translate-y-1/2 flex-wrap items-center gap-2">
        <p className="whitespace-nowrap font-sans text-[clamp(24px,4vw,40px)] leading-none tracking-[-0.03em] text-[#333]">
          DRIVEN BY
        </p>
        <SkewSerif>
          <span className="whitespace-nowrap text-[clamp(24px,4vw,40px)] leading-none text-[#333]">
            LOGIC,{" "}
          </span>
        </SkewSerif>
      </div>
      <div className="pointer-events-none absolute right-[calc(clamp(1rem,5vw,2.5rem)-2.5rem)] top-1/2 z-[3] flex max-w-[min(100%,28rem)] -translate-y-1/2 flex-wrap items-end justify-end gap-2 text-right">
        <p className="whitespace-nowrap font-sans text-[clamp(24px,4vw,40px)] leading-none tracking-[-0.03em] text-[#333]">
          DEFINED BY{" "}
        </p>
        <SkewSerif>
          <span className="whitespace-nowrap text-[clamp(24px,4vw,40px)] leading-none text-[#333]">
            DESIGN.
          </span>
        </SkewSerif>
      </div>
    </div>
  );
}

/** 左見出しのみ sticky。外側を sticky で包まない（包むと親高＝本文高になり下まで届かない） */
function AboutGrid() {
  return (
    <>
      <div className="col-span-12 sticky top-24 z-10 self-start md:col-span-4">
        <div className="flex items-start pb-2">
          <div className="flex flex-col gap-0.5">
            <span className="whitespace-nowrap font-sans text-[40px] leading-none text-[#333]">
              ABOUT
            </span>
          </div>
          <SkewSerif>
            <span className="whitespace-nowrap text-[40px] leading-none text-[#333]">ME</span>
          </SkewSerif>
        </div>
      </div>
      <div className="col-span-12 flex min-w-0 flex-col gap-10 pb-16 md:col-span-6 md:col-start-7">
        <div className="aspect-[160/90] w-full overflow-hidden bg-[#eceff1]" aria-hidden="true">
          <img src={pfImg2} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col gap-6 text-[#333]">
          <p className="w-full font-jp text-[16px] font-medium leading-[1.8] tracking-[0.08em]">
            東京を拠点にするウェブデザイナーです。エンジニア主体の開発会社で仕事をしながら、ビジュアルを描くことと、その手前の要件を整えること、その両方を自然に行き来するようなプロセスを大切にしています。良いデジタル体験は、見た目だけでなく「どう作られているか」という思慮深い構造から生まれると考えています。プロジェクトを俯瞰して捉え、デザインとその裏側にあるデータを、シンプルで誠実な方法でつなぐプロセスを大切にしています。
          </p>
          <p className="w-full font-sans text-[14px] leading-[1.5] tracking-[0.08em]">
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

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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

  const phases = useMemo(() => {
    const P_IMG_END = 0.18;
    const P_LEFT_START = 0.18;
    const P_LEFT_END = 0.38;
    const P_RIGHT_START = 0.38;
    const P_RIGHT_END = 0.58;

    const imgT = smoothstep(invLerp(0, P_IMG_END, progress));
    const leftT = smoothstep(invLerp(P_LEFT_START, P_LEFT_END, progress));
    const rightT = smoothstep(invLerp(P_RIGHT_START, P_RIGHT_END, progress));

    const imageY = (1 - imgT) * 0.14 * vh;
    const leftY = (1 - leftT) * -vh;
    const rightY = (1 - rightT) * vh;

    return { imageY, leftY, rightY };
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

  return (
    <div
      className="relative mx-auto flex min-h-screen w-full flex-col items-start bg-[#f5f7f8]"
      data-name="Top"
      style={overlapStyle}
    >
      <div className="pointer-events-none fixed inset-0 z-[40] [&_*]:pointer-events-none">
        <HeroTitleBlock shrink={persistentTitleShrink} />
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
                <div
                  className="pointer-events-none absolute z-[22] h-[min(598px,70vh)] w-[min(448px,90vw)] overflow-hidden bg-[#eceff1]"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) translateY(${phases.imageY}px)`,
                  }}
                  aria-hidden="true"
                >
                  <img src={pfImg2} alt="" className="h-full w-full object-cover" />
                </div>
                <div
                  className="pointer-events-none absolute left-[calc(clamp(1rem,5vw,2.5rem)-2.5rem)] top-1/2 z-[23] flex max-w-[min(100%,28rem)] flex-wrap items-center gap-2"
                  style={{
                    transform: `translateY(calc(-50% + ${phases.leftY}px))`,
                  }}
                >
                  <p className="whitespace-nowrap font-sans text-[clamp(24px,4vw,40px)] leading-none tracking-[-0.03em] text-[#333]">
                    DRIVEN BY
                  </p>
                  <SkewSerif>
                    <span className="whitespace-nowrap text-[clamp(24px,4vw,40px)] leading-none text-[#333]">
                      LOGIC,{" "}
                    </span>
                  </SkewSerif>
                </div>
                <div
                  className="pointer-events-none absolute right-[calc(clamp(1rem,5vw,2.5rem)-2.5rem)] top-1/2 z-[23] flex max-w-[min(100%,28rem)] flex-wrap items-end justify-end gap-2 text-right"
                  style={{
                    transform: `translateY(calc(-50% + ${phases.rightY}px))`,
                  }}
                >
                  <p className="whitespace-nowrap font-sans text-[clamp(24px,4vw,40px)] leading-none tracking-[-0.03em] text-[#333]">
                    DEFINED BY{" "}
                  </p>
                  <SkewSerif>
                    <span className="whitespace-nowrap text-[clamp(24px,4vw,40px)] leading-none text-[#333]">
                      DESIGN.
                    </span>
                  </SkewSerif>
                </div>
              </div>
            </div>
          </div>
        )}

        {showFixedHeroLayer && (
          <div className="pointer-events-none fixed inset-0 z-[1] flex h-screen w-full flex-col overflow-hidden bg-[#f5f7f8]">
            <div className="relative flex min-h-0 flex-1 flex-col p-10 pt-24">
              <TrioAtRest />
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
          <div className="px-10 pb-20 pt-[120px]">
            <div className="grid w-full grid-cols-12 gap-x-6 gap-y-10 md:gap-x-10">
              <AboutGrid />
            </div>
          </div>
        </section>

        <section
          ref={workRef}
          id="work"
          className="relative z-[2] w-full shrink-0 border-t border-[#b0bec5] bg-[#f5f7f8] px-10 pb-20 pt-[120px]"
        >
          <div
            className={`grid w-full grid-cols-12 gap-x-6 gap-y-10 transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100 md:gap-x-10 ${
              workReveal ? "translate-y-0 opacity-100" : "translate-y-14 opacity-0"
            }`}
          >
            <div className="col-span-12 sticky top-24 z-10 self-start md:col-span-4">
              <div className="flex items-start pb-2">
                <div className="flex flex-col gap-0.5">
                  <span className="whitespace-nowrap font-sans text-[40px] leading-none text-[#333]">
                    RECENT
                  </span>
                </div>
                <SkewSerif>
                  <span className="whitespace-nowrap text-[40px] leading-none text-[#333]">WORK</span>
                </SkewSerif>
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

      {/* Statement: ピン長は class の min(45vh,28rem) を変更 */}
      <section
        className="relative z-10 h-[calc(100vh+min(45vh,28rem))] w-full shrink-0 bg-[#f5f7f8]"
        aria-label="Statement"
      >
        <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center bg-[#f5f7f8] py-20">
          <div className="relative mx-auto w-[min(448px,90vw)]">
            <WorkBelowPortraitBlock />
            <WorkBelowStatementMarquee
              textClass="text-[clamp(36px,7vw,80px)]"
              scrollY={scrollY}
            />
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="relative z-10 flex w-full items-start justify-between overflow-hidden bg-[#f5f7f8] px-10"
      >
        <div className="flex w-full flex-wrap items-center gap-16 py-24 md:flex-nowrap">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <p className="whitespace-nowrap text-center font-sans text-[128px] leading-none tracking-[-0.03em] text-[#333] pr-4">
              GET
            </p>
            <p className="whitespace-nowrap text-center font-sans text-[128px] leading-none tracking-[-0.03em] text-[#333] pr-4">
              IN
            </p>
            <SkewSerif>
              <span className="whitespace-nowrap text-[128px] leading-none tracking-[0.02em] text-[#333]">
                TOUCH
              </span>
            </SkewSerif>
          </div>
          <button
            type="button"
            className="flex size-[240px] shrink-0 items-center justify-center rounded-full border border-black text-[#333]"
            aria-label="お問い合わせ"
          >
            <CtaArrow />
          </button>
        </div>
      </section>

      <footer className="relative z-10 flex w-full flex-col items-start overflow-hidden bg-[#f5f7f8] pb-10">
      <div className="flex w-full items-start gap-40 border-t border-[#cfd8dc] pt-10">
        <div className="w-full px-10 flex items-start">
        
          <div className="flex h-10 w-full items-start">
            <div className="flex flex-col items-start gap-60">
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap text-center font-sans text-[40px] leading-none tracking-[-0.03em] text-[#333]">
                  TINA
                </span>
                <SkewSerif>
                  <span className="whitespace-nowrap text-[40px] leading-none text-[#333]">
                    KATONO
                  </span>
                </SkewSerif>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-end justify-end">
            <p className="whitespace-nowrap font-jp text-xl leading-[1.6] text-[#333]">
            © 2026 Tina Katono
            </p>
          </div>
        </div>
        </div>
      </footer>

      <SiteHeader />
    </div>
  );
}
