import { MARK_IMAGE_BLUE_EYES } from "./brand";
import type { WorkMember } from "../data/workDetails";

/**
 * 印の直径。行に並べるので、丸だけが浮かないよう文字より一回り大きい程度に留める。
 */
const AVATAR_SIZE = "1.75rem";

/**
 * 印を 1 行目の文字の高さの中心に合わせるための下げ幅。
 * 印（28px）は行の高さ（13px × 1.6 ≒ 21px）より大きいので、
 * items-start のままだと印の上端が文字の上端に揃って重心がずれる。
 */
const AVATAR_NUDGE_Y = "-0.2rem";

/**
 * 案件の体制と、そのなかでの自分の担当。**ROLE 欄と統合したもの。**
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
  return (
    /*
      白地は内容の幅にとどめる（w-fit）。幅いっぱいに広げると、一人だけの案件で
      カードの右側が大きく空いて未完成に見える。サイドバーの他の値も
      文字幅ぴったりの白地なので、そちらとも揃う。
    */
    <ul className="m-0 flex w-fit max-w-full list-none flex-col gap-3 rounded-[16px] bg-white px-4 py-4">
      {members.map((member, i) => (
        <li key={`${member.label}-${i}`} className="flex items-start gap-3">
          {member.self ? (
            <img
              src={MARK_IMAGE_BLUE_EYES}
              alt=""
              aria-hidden="true"
              className="block shrink-0 object-contain"
              style={{
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
                marginTop: AVATAR_NUDGE_Y,
              }}
            />
          ) : (
            <span
              aria-hidden="true"
              className="block shrink-0 rounded-full bg-[#b0bec5]"
              style={{
                width: AVATAR_SIZE,
                height: AVATAR_SIZE,
                marginTop: AVATAR_NUDGE_Y,
              }}
            />
          )}

          <span className="font-sans text-[13px] leading-[1.6] tracking-[0.04em] text-[#333]">
            {member.label}
            {/*
              自分の行にだけ担当を続ける。全角の空きで区切ると、折り返したときに
              名前と担当が地続きに見えてしまうので、別の要素にして間隔を持たせる。
            */}
            {member.self && roles.length ? (
              <span className="ml-3 text-[#546e7a]">
                {/*
                  役割ごとに nowrap で包み、区切りの空白だけを折り返し位置にする。
                  1 つの文字列にすると和文はどこでも改行できてしまい、
                  「ライティング」が「ライティン／グ」のように 1 文字だけ次行に落ちる。
                */}
                {roles.map((role, r) => (
                  <span key={role}>
                    <span className="whitespace-nowrap">{role}</span>
                    {r < roles.length - 1 ? " / " : null}
                  </span>
                ))}
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
}
