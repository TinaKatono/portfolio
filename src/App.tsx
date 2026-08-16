import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
/**
 * 戻ったときにスクロール位置の復元を諦めるまでの時間。
 * ページの高さが画像の読み込みで伸びきるのを待つため、1 フレームでは足りない。
 */
const SCROLL_RESTORE_MS = 800;

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
  /**
   * 履歴のエントリごとのスクロール位置。戻る・進むで元の位置に返すために持つ。
   * リロードすると失われるので、その直後の「戻る」だけは先頭に着く（ブラウザ任せに
   * 戻しても、下記の理由で正しい位置には復元されないため、そこは割り切っている）。
   */
  const scrollPositions = useRef(new Map<string, number>());

  /*
    ブラウザ任せのスクロール復元を切る。**退場アニメを入れている以上これが要る。**

    ルートの差し替えを PAGE_LEAVE_MS だけ遅らせているため、ブラウザが復元を試みる
    時点では、まだ前のページ（案件詳細）が表示されている。復元先はそのページの高さで
    頭打ちになり、あとから背の高い TOP が出てきても位置は戻らない。
    実測では TOP の 5247px へ戻るはずが、詳細ページの高さ（2093px）に引っかかって
    1183px で止まっていた。
  */
  useEffect(() => {
    if (!("scrollRestoration" in window.history)) return;
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useEffect(() => {
    // ハッシュだけの変更（/#about など）はページ送りではないので、そのまま反映する
    if (location.pathname === displayed.pathname) {
      setDisplayed(location);
      return;
    }
    /*
      ここではまだ前のページが表示されたままなので、いま読める位置が「離れる前の位置」。
      差し替えたあとに読んでも、新しいページの位置になっていて手遅れになる。
    */
    scrollPositions.current.set(displayed.key, window.scrollY);

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
  */
  useLayoutEffect(() => {
    if (navigationType !== "POP") {
      // ハッシュ付きの遷移は下の効果に任せる（先頭へ戻すと目的の位置から一度離れる）
      if (!displayed.hash) window.scrollTo(0, 0);
      return;
    }

    const target = scrollPositions.current.get(displayed.key);
    if (target === undefined) return;

    /*
      すぐに戻せるとは限らない。画像の読み込みでページの高さは描画後も伸びるため、
      その時点の高さで位置が頭打ちになる。**戻したい位置まで届く高さになるのを待つ。**
      毎フレーム scrollTo を撃ち続けると、その間の利用者の操作を奪ってしまうので、
      位置を触るのは高さが足りたとき（か、諦めたとき）の一度だけにする。
    */
    let canceled = false;
    const startedAt = performance.now();
    const step = () => {
      if (canceled) return;
      const reachable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (reachable >= target || performance.now() - startedAt > SCROLL_RESTORE_MS) {
        window.scrollTo(0, target);
        return;
      }
      window.requestAnimationFrame(step);
    };
    step();
    return () => {
      canceled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayed.key]);

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
