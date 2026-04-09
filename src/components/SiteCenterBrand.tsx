/** ヒーロー縮小後相当（HeroTitleBlock shrink=1）と同じ見た目で中央固定（サブページ用） */
export function SiteCenterBrand() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-[28px]"
      aria-hidden
    >
      <div
        className="inline-flex max-w-full flex-wrap items-center justify-center gap-4 text-[32px] leading-none text-[#333]"
      >
        <p className="whitespace-nowrap pr-4 text-center font-sans leading-none tracking-[-0.03em]">
          TINA
        </p>
        <span className="whitespace-nowrap font-serif not-italic leading-none tracking-[0.02em]">
          KATONO
        </span>
      </div>
    </div>
  );
}
