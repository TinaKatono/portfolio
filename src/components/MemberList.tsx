import { MARK_IMAGE_BLUE_EYES } from "./brand";
import type { WorkMember } from "../data/workDetails";

/**
 * 丸の直径。ラベルの幅（ITEM_WIDTH）より小さくしておくと、
 * 「ディレクター」のような長いラベルが 2 行になっても丸の位置が揃う。
 */
const AVATAR_SIZE = "2.75rem";

/**
 * 1 人分の幅。**固定にするのが要点。**
 * 内容に合わせて伸びる指定にすると、ラベルの文字数で丸の間隔がばらつき、
 * 人数が変わるたびに並びの印象が変わってしまう。
 *
 * 12px の全角 7 文字（「プロデューサー」など）が 1 行に収まる幅にしてある。
 * これより狭いと「ディレクター」が「ディレクタ／ー」と割れて、
 * 最後の 1 文字だけが 2 行目に落ちる。
 */
const ITEM_WIDTH = "5.5rem";

/**
 * 案件の体制。他のメンバーはグレーの丸、自分だけブランドの青い印で示す。
 *
 * **他のメンバーを個人として描き分けないこと。** ここで伝えたいのは
 * 「どういう役割の人と組んだか」と「そのなかで自分がどこにいたか」で、
 * 相手が誰かではない（クライアント側の人員構成は公開情報ではない）。
 * グレーの無地の丸にしてあるのはそのため。
 */
export function MemberList({ members }: { members: readonly WorkMember[] }) {
  return (
    /*
      白地は内容の幅にとどめる（w-fit）。幅いっぱいに広げると、一人だけの案件で
      カードの右側が大きく空いて未完成に見える。サイドバーの他の値も
      文字幅ぴったりの白地なので、そちらとも揃う。
      max-w-full を併せて置き、人数が増えたときは折り返させる。
    */
    <ul className="m-0 flex w-fit max-w-full list-none flex-wrap gap-x-2 gap-y-4 rounded-[16px] bg-white px-4 py-4">
      {members.map((member, i) => (
        <li
          key={`${member.label}-${i}`}
          className="flex flex-col items-center gap-2"
          style={{ width: ITEM_WIDTH }}
        >
          {member.self ? (
            <img
              src={MARK_IMAGE_BLUE_EYES}
              alt=""
              aria-hidden="true"
              className="block shrink-0 object-contain"
              style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
            />
          ) : (
            <span
              aria-hidden="true"
              className="block shrink-0 rounded-full bg-[#b0bec5]"
              style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
            />
          )}
          <span className="text-center font-sans text-[12px] leading-[1.5] tracking-[0.04em] text-[#333]">
            {member.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
