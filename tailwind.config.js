/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      /**
       * 本命は「A P-OTF A1ゴシック StdN B」だが、モリサワ商用書体のため Web 配信には
       * 別途 Web フォントライセンス（Adobe Fonts / TypeSquare 等）が必要。
       * 現状は骨格の近い無償書体 Zen Kaku Gothic New で代替している。
       * ライセンスが用意できたら、下記 2 つの先頭に実際のファミリー名を差すだけで切り替わる。
       */
      fontFamily: {
        sans: ["Zen Kaku Gothic New", "Hiragino Sans", "system-ui", "sans-serif"],
        /** 現在どこからも使っていない。使うなら index.html に Cardo の読み込みを戻すこと */
        serif: ["Cardo", "Georgia", "serif"],
        jp: ["Zen Kaku Gothic New", "Hiragino Sans", "sans-serif"],
      },
      keyframes: {
        workRoleTipIn: {
          "0%": {
            opacity: "0",
            transform: "scale(0.82) translateY(10px)",
            filter: "blur(4px)",
          },
          "65%": {
            opacity: "1",
            transform: "scale(1.04) translateY(-2px)",
            filter: "blur(0)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1) translateY(0)",
            filter: "blur(0)",
          },
        },
        workRoleTextIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        /** ヒーロー名：ぼかし→くっきり（一文字ずつ delay で連続再生） */
        heroCharIn: {
          "0%": {
            opacity: "0",
            filter: "blur(10px)",
            transform: "translateY(0.12em)",
          },
          "100%": {
            opacity: "1",
            filter: "blur(0)",
            transform: "translateY(0)",
          },
        },
        /**
         * 単語間の図形をゆっくり回し続ける。
         * translateY はベースライン補正（InlineMark の nudgeY）。animation の transform は
         * インラインスタイルを上書きしてしまうため、補正値を CSS 変数で受け取って合成している。
         * 変数が無い場合は 0 として扱うので、補正なしで使っても崩れない。
         */
        markSpin: {
          from: { transform: "translateY(var(--mark-nudge-y, 0)) rotate(0deg)" },
          to: { transform: "translateY(var(--mark-nudge-y, 0)) rotate(360deg)" },
        },
        /** ヒーロー中央写真下：スクロール誘導矢印 */
        scrollHintBounce: {
          "0%, 100%": {
            transform: "translate3d(0,0,0)",
            opacity: "0.55",
          },
          "50%": {
            transform: "translate3d(0,7px,0)",
            opacity: "1",
          },
        },
      },
      animation: {
        "work-role-tip-in":
          "workRoleTipIn 0.48s cubic-bezier(0.34, 1.25, 0.64, 1) both",
        "work-role-text-in":
          "workRoleTextIn 0.32s ease-out 0.06s both",
        "hero-char-in":
          "heroCharIn 0.52s cubic-bezier(0.2, 0.85, 0.25, 1) both",
        "scroll-hint-bounce":
          "scrollHintBounce 1.35s ease-in-out infinite",
        /** 1 周 22 秒。等速で、目で追わなくても気にならない速さ */
        "mark-spin": "markSpin 22s linear infinite",
      },
    },
  },
  plugins: [],
};
