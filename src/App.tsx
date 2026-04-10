import { useLayoutEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Top from "./Top";
import WorkDetail from "./pages/WorkDetail";

/** Vite の `base`（例: GitHub Pages の `/portfolio/`）と React Router を揃える */
function routerBasename(): string | undefined {
  const base = import.meta.env.BASE_URL;
  if (base === "/" || base === "") return undefined;
  const trimmed = base.replace(/\/$/, "");
  return trimmed || undefined;
}

/**
 * ルート変更時は先頭へ。`/#about` などハッシュ付きでは、トップ表示後に該当セクションへスクロールする。
 * pathname のみのときはトップのみ（同じページ内で hash だけ変えたときはトップに戻さない）。
 */
function RouteScrollEffects() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useLayoutEffect(() => {
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
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={routerBasename()}>
      <RouteScrollEffects />
      <Routes>
        <Route path="/" element={<Top />} />
        <Route path="/works/:id" element={<WorkDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
