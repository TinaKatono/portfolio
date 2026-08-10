import { BRAND_COLORS } from "./brand";

/**
 * 役割ごとに固定の色。**同じ役割はどの案件でも同じ色**になるように、並び順ではなく
 * 内容で引く（以前は並び順で振っていたので、案件ごとに同じ役割の色がぶれていた）。
 *
 * 使える色は 4 色なので系統でまとめてある:
 * ピンク = UI・ビジュアル / 青 = UX・体験設計 / 緑 = 情報設計・言葉 / 黄 = 実装・進行。
 *
 * 現在の案件では、この割り当てだと 1 案件の中で同じ色が隣り合わない。
 * 役割を追加するときは、同じ案件に並ぶ他の役割と色がぶつからないか見ること。
 */
const ROLE_COLORS: Record<string, string> = {
  "UI Design": BRAND_COLORS.pink,
  "UX Design": BRAND_COLORS.blue,
  "Information Architecture": BRAND_COLORS.green,
  Writing: BRAND_COLORS.green,
  "UI Implementation": BRAND_COLORS.pink,
  "Requirements Definition": BRAND_COLORS.yellow,
  Planning: BRAND_COLORS.yellow,
  "Frontend Dev(Cursor)": BRAND_COLORS.yellow,
  "Frontend Dev(HTML/CSS/jQuery)": BRAND_COLORS.yellow,
  "Full-stack Dev(Claude Code)": BRAND_COLORS.yellow,
  "No-code Dev(Studio)": BRAND_COLORS.yellow,
};

const DOT_COLORS = [
  BRAND_COLORS.pink,
  BRAND_COLORS.blue,
  BRAND_COLORS.green,
  BRAND_COLORS.yellow,
];

/**
 * 表に無い役割でも案件をまたいで同じ色になるよう、文字列から決める。
 * 色の系統は揃わないので、**継続して使う役割は ROLE_COLORS に足すこと**。
 */
function roleColor(role: string): string {
  const fixed = ROLE_COLORS[role];
  if (fixed) return fixed;
  let hash = 0;
  for (let i = 0; i < role.length; i += 1) {
    hash = (hash * 31 + role.charCodeAt(i)) % 100003;
  }
  return DOT_COLORS[hash % DOT_COLORS.length];
}

/**
 * 丸のサイズ（文字サイズ基準）。
 * items-baseline の行では丸の下端がベースラインに乗り、それだけでほぼ x-height の
 * 中心に来るので追加の補正は要らない。
 */
const DOT_SIZE = "0.72em";

/**
 * ROLE の一覧。1 項目 1 行にして頭に色付きの丸を置く。
 * WORK 一覧のホバーツールチップと案件詳細ページの両方から使うので、
 * 見た目を変えるときはここだけ直せば両方に反映される。
 *
 * 文字サイズ・色・アニメーションは置き場所ごとに違うので className で受け取る
 * （丸は em 指定なので、渡された文字サイズにそのまま追従する）。
 */
export function RoleList({
  roles,
  className = "",
  itemClassName = "",
}: {
  roles: readonly string[];
  className?: string;
  /**
   * 1 項目（1 行）ごとに当てるクラス。地色を敷きたいときはここに渡す。
   * ul 側に敷くと項目をまたいだ 1 枚の面になってしまい、行ごとに独立しない。
   */
  itemClassName?: string;
}) {
  return (
    <ul className={`m-0 flex list-none flex-col gap-1 p-0 ${className}`}>
      {roles.map((role, i) => (
        <li key={`${i}-${role}`} className={`flex w-fit items-baseline gap-2 ${itemClassName}`}>
          <span
            className="inline-block shrink-0 rounded-full"
            style={{
              width: DOT_SIZE,
              height: DOT_SIZE,
              backgroundColor: roleColor(role),
            }}
            aria-hidden="true"
          />
          {role}
        </li>
      ))}
    </ul>
  );
}
