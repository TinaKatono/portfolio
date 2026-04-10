import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Navigate, useParams } from "react-router-dom";
import { SkewSerif } from "../components/brand";
import { SiteCenterBrand } from "../components/SiteCenterBrand";
import { SiteHeader } from "../components/SiteHeader";
import { hasWorkDetail, workDetails } from "../data/workDetails";

/** bottom のみの sticky は Flex 内で効かないことが多いので、top を「下端固定」相当に計算する */
function OverviewSticky({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [heightPx, setHeightPx] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      setHeightPx(Math.ceil(el.getBoundingClientRect().height));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const h = heightPx || 420;
  const stickyTop: CSSProperties = {
    top: `max(5rem, calc(100svh - ${h}px - 2rem))`,
  };

  return (
    <div
      ref={ref}
      className="w-full max-w-xl pb-2 lg:sticky lg:z-10 lg:self-start"
      style={stickyTop}
    >
      {children}
    </div>
  );
}

export default function WorkDetail() {
  const { id } = useParams<{ id: string }>();
  if (!id || !hasWorkDetail(id)) {
    return <Navigate to="/" replace />;
  }
  const detail = workDetails[id];

  return (
    <div className="relative mx-auto flex min-h-screen w-full flex-col items-start bg-[#f5f7f8]">
      <SiteCenterBrand />
      <SiteHeader />

      <main className="w-full shrink-0 border-t border-[#b0bec5] px-10 pb-20 pt-[120px]">
        <div className="flex w-full flex-col gap-16 lg:flex-row lg:items-stretch lg:gap-20">
          <aside className="flex min-w-0 flex-1 flex-col lg:min-h-0">
            <OverviewSticky>
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-2.5">
                  <h1 className="font-sans text-[40px] leading-none text-[#333]">{detail.title}</h1>
                  <p className="max-w-xl font-jp text-[16px] font-medium leading-[1.8] tracking-[0.08em] text-[#333]">
                    {detail.titleJa}
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  <h2 className="font-sans text-[16px] leading-none text-[#333]">ROLE</h2>
                  <p className="w-fit max-w-full bg-white font-sans text-[13px] leading-[1.5] tracking-[0.04em] text-black">
                    {detail.roles.join(", ")}
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  <h2 className="font-sans text-[16px] leading-none text-[#333]">YEAR / DURATION</h2>
                  <p className="w-fit max-w-full bg-white font-sans text-[13px] leading-[1.5] tracking-[0.04em] text-black">
                    {detail.yearDuration}
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  <h2 className="font-sans text-[16px] leading-none text-[#333]">Tools</h2>
                  <p className="w-fit max-w-full bg-white font-sans text-[13px] leading-[1.5] tracking-[0.04em] text-black">
                    {detail.tools.join(", ")}
                  </p>
                </div>
              </div>
            </OverviewSticky>
          </aside>

          <div className="flex w-full shrink-0 flex-col gap-10 lg:max-w-[668px]">
            {detail.sections.map((section, i) => (
              <div key={i} className="flex flex-col gap-6">
                <div className="aspect-video w-full shrink-0 bg-[#eceff1]" aria-hidden />
                <div className="flex flex-col gap-6 text-[#333]">
                  <p className="font-jp text-[16px] font-medium leading-[1.8] tracking-[0.08em]">
                    {section.ja}
                  </p>
                  <p className="font-sans text-[14px] leading-[1.5] tracking-[0.08em]">{section.en}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* <section
        id="contact"
        className="relative z-10 flex w-full items-start justify-between overflow-hidden bg-[#f5f7f8] px-10"
      >
        <div className="flex w-full flex-wrap items-center gap-16 py-24 md:flex-nowrap">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <p className="whitespace-nowrap pr-4 text-center font-sans text-[128px] leading-none tracking-[-0.03em] text-[#333]">
              GET
            </p>
            <p className="whitespace-nowrap pr-4 text-center font-sans text-[128px] leading-none tracking-[-0.03em] text-[#333]">
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
      </section> */}

      <footer className="relative z-10 flex w-full flex-col items-start overflow-hidden bg-[#f5f7f8] pb-10">
        <div className="flex w-full items-start gap-40 border-t border-[#cfd8dc] pt-10">
          <div className="flex w-full items-start px-10">
            <div className="flex h-10 w-full items-start">
              <div className="flex flex-col items-start gap-60">
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap text-center font-sans text-[40px] leading-none tracking-[-0.03em] text-[#333]">
                    TINA
                  </span>
                  <SkewSerif>
                    <span className="whitespace-nowrap text-[40px] leading-none text-[#333]">KATONO</span>
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
    </div>
  );
}
