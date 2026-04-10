/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
        serif: ["Cardo", "Georgia", "serif"],
        jp: ["Noto Sans JP", "sans-serif"],
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
      },
    },
  },
  plugins: [],
};
