import { BRAND_COLORS } from "./brand";

/** 各項目の頭に置く丸に順番に当てる色。項目数が色数を超えたら先頭に戻る */
const DOT_COLORS = [
  BRAND_COLORS.pink,
  BRAND_COLORS.blue,
  BRAND_COLORS.green,
  BRAND_COLORS.yellow,
];

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
}: {
  roles: readonly string[];
  className?: string;
}) {
  return (
    <ul className={`m-0 flex list-none flex-col gap-1.5 p-0 ${className}`}>
      {roles.map((role, i) => (
        <li key={`${i}-${role}`} className="flex items-baseline gap-2">
          <span
            className="inline-block shrink-0 rounded-full"
            style={{
              width: DOT_SIZE,
              height: DOT_SIZE,
              backgroundColor: DOT_COLORS[i % DOT_COLORS.length],
            }}
            aria-hidden="true"
          />
          {role}
        </li>
      ))}
    </ul>
  );
}
