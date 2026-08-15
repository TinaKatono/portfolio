import { useEffect, useLayoutEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigationType,
  type Location,
} from "react-router-dom";
import Top from "./Top";
import Contact from "./pages/Contact";
import WorkDetail from "./pages/WorkDetail";

/** Vite の `base`（例: GitHub Pages の `/portfolio/`）と React Router を揃える */
function routerBasename(): string | undefined {
  const base = import.meta.env.BASE_URL;
  if (base === "/" || base === "") return undefined;
  const trimmed = base.replace(/\/$/, "");
  return trimmed || undefined;
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** 退場にかける時間。長いとページ送りがもたつくので短く保つ */
const PAGE_LEAVE_MS = 260;
/** 退場で下へ沈める量 */
const PAGE_LEAVE_SHIFT = "26px";

/**
 * ページ切り替えの演出。**今いるページを下へフェードアウトさせてから**次を出す。
 *
 * URL が変わってもすぐには描き替えず、`displayed` に「いま表示しているルート」を
 * 保持しておくのが要点。React Router は既定だと即座に差し替えてしまうので、
 * 退場アニメを見せる余地がない。
 *
 * **沈める動きに transform を使わないこと。** transform（scale や translate も同じ）を
 * 祖先に掛けると position: fixed の基準がその要素に変わり、ヒーローの固定レイヤーや
 * ヘッダーが画面上の定位置から外れて飛ぶ。ここでは position: relative + top で動かす。
 */
function AnimatedRoutes() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [displayed, setDisplayed] = useState<Location>(location);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // ハッシュだけの変更（/#about など）はページ送りではないので、そのまま反映する
    if (location.pathname === displayed.pathname) {
      setDisplayed(location);
      return;
    }
    if (prefersReducedMotion()) {
      setDisplayed(location);
      return;
    }
    setLeaving(true);
    const t = window.setTimeout(() => {
      setDisplayed(location);
      setLeaving(false);
    }, PAGE_LEAVE_MS);
    return () => window.clearTimeout(t);
  }, [location, displayed]);

  /*
    スクロール位置の調整は「URL が変わったとき」ではなく「新しいページを描いたとき」に行う。
    URL の変化で動かすと、まだ画面に残っている退場中のページが先頭へ跳ねてしまう。

    戻る・進む（POP）では位置を触らない。ここで先頭へ戻すと、そのあとブラウザ自身の
    復元が走って「一番上から前回位置まで滑っていく」動きになり、毎回それを見せられる。
  */
  useLayoutEffect(() => {
    if (navigationType === "POP") return;
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayed.pathname]);

  useLayoutEffect(() => {
    if (navigationType === "POP") return;
    const hash = displayed.hash;
    if (!hash) return;
    const id = hash.replace(/^#/, "");
    if (!id) return;
    let canceled = false;
    const run = () => {
      if (canceled) return;
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };
    requestAnimationFrame(() => {
      requestAnimationFrame(run);
    });
    return () => {
      canceled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayed.pathname, displayed.hash]);

  return (
    <div
      className="relative transition-[opacity,top] ease-out motion-reduce:transition-none"
      style={{
        top: leaving ? PAGE_LEAVE_SHIFT : "0px",
        opacity: leaving ? 0 : 1,
        transitionDuration: `${PAGE_LEAVE_MS}ms`,
      }}
    >
      <Routes location={displayed}>
        <Route path="/" element={<Top />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/works/:id" element={<WorkDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={routerBasename()}>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
