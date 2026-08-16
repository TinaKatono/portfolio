import { MARK_IMAGE_BLUE_EYES } from "./brand";
import { ChipList } from "./ChipList";
import type { WorkMember } from "../data/workDetails";

/** 自分の印の直径（px）。1 行目の文字の高さ（13px × 1.6 ≒ 21px）とほぼ同じ */
const SELF_SIZE = 20;

/** 他のメンバーの丸の直径（px）。自分の印より一回り小さくして、自分の行を沈ませない */
const OTHER_SIZE = 16;

/**
 * 丸を複数並べるときの 1 個あたりの送り幅（px）。
 * 直径より小さいので丸どうしが重なる。**間隔をあけて並べないこと。**
 * 3 個並べると印の欄が 60px 前後になり、サイドバーが最も狭くなる 768px
 * （タブレット縦）では役割名の幅を 3 割近く食う。
 */
const STACK_STEP = 10;

/**
 * 丸で人数を示す上限。これを超えたら 1 個 ＋「× N」に戻す。
 * 数えて分かるのは 4 個までで、それ以上は丸が並ぶだけで人数が読み取れない。
 */
const MAX_DOTS = 4;

/** 重なった丸を切り分ける縁。地色と同じ色で、丸どうしが 1 つの塊に見えるのを防ぐ */
const DOT_RING = "0 0 0 1.5px #f5f7f8";

/** その行に描く丸の数。自分は 1 個、上限超えも 1 個（横に「× N」が付く） */
function dotCount(member: WorkMember): number {
  if (member.self) return 1;
  const count = member.count ?? 1;
  return count <= MAX_DOTS ? count : 1;
}

function stackWidth(dots: number): number {
  return OTHER_SIZE + (dots - 1) * STACK_STEP;
}

/**
 * 案件の体制と、そのなかでの自分の担当（詳細ページの TEAM 欄）。
 *
 * 以前は ROLE（自分の担当）と MEMBERS（体制）を別の欄に分けていたが、
 * 体制側の「私」が何の情報も持たず、担当は上の ROLE に書いてある、という
 * 重複した見え方になっていた。自分の行に担当をそのまま並べれば 1 つで足りる。
 *
 * **他のメンバーを個人として描き分けないこと。** ここで伝えたいのは
 * 「どういう役割の人と組んだか」と「そのなかで自分が何をしたか」で、
 * 相手が誰かではない（クライアント側の人員構成は公開情報ではない）。
 * グレーの無地の丸にしてあるのはそのため。
 *
 * 体制が分からない案件では**この表示を使わないこと。** 自分の行だけを出すと
 * 「一人でやった」と読めてしまう。呼び出し側で ROLE 表示に切り替える。
 */
export function MemberList({
  members,
  roles,
}: {
  members: readonly WorkMember[];
  roles: readonly string[];
}) {
  /*
    印の欄はそのページの最大人数に合わせて固定幅にする。**行ごとに可変にしないこと。**
    1 人の行と 3 人の行で役割名の開始位置がずれて、並びが崩れる。
  */
  const columnPx = Math.max(
    SELF_SIZE,
    ...members.map((member) => stackWidth(dotCount(member)))
  );

  return (
    <ul className="m-0 mt-4 flex w-fit max-w-full list-none flex-col gap-3">
      {members.map((member, i) => {
        const dots = dotCount(member);
        /* 丸に収めきれなかった人数だけ数字で補う */
        const overflowCount =
          !member.self && (member.count ?? 1) > MAX_DOTS ? member.count : null;

        return (
          <li key={`${member.label}-${i}`} className="flex items-start gap-3">
            {/* 高さは 1 行目の文字の高さ。中央寄せなので印の寸法を変えても縦位置の調整が要らない */}
            <span
              aria-hidden="true"
              className="flex h-[1.3rem] shrink-0 items-center"
              style={{ width: `${columnPx}px` }}
            >
              {member.self ? (
                <img
                  src={MARK_IMAGE_BLUE_EYES}
                  alt=""
                  className="block object-contain"
                  style={{ width: SELF_SIZE, height: SELF_SIZE }}
                />
              ) : (
                Array.from({ length: dots }, (_, d) => (
                  <span
                    key={d}
                    className="block rounded-full bg-[#b0bec5]"
                    style={{
                      width: OTHER_SIZE,
                      height: OTHER_SIZE,
                      marginLeft: d === 0 ? 0 : STACK_STEP - OTHER_SIZE,
                      boxShadow: d === 0 ? undefined : DOT_RING,
                    }}
                  />
                ))
              )}
            </span>

            <span className="min-w-0 font-sans text-[13px] leading-[1.6] tracking-[0.04em] text-[#333]">
              <span className="break-keep">
                {member.label}
                {overflowCount ? (
                  <span className="text-[#546e7a]">{` × ${overflowCount}`}</span>
                ) : null}
              </span>

              {/*
                自分の行にだけ担当を続ける。名前と地続きに見えないよう間隔を持たせる。
              */}
              {member.self && roles.length ? (
                <ChipList items={roles} className="ml-3" />
              ) : null}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
