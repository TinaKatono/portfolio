import { MARK_IMAGE_BLUE_EYES } from "./brand";
import type { WorkMember } from "../data/workDetails";

/**
 * 印の直径。1 行目の文字の高さ（13px × 1.6 ≒ 21px）とほぼ同じにしてあり、
 * 行の中で印だけが目立たない。役割名の方を読ませたいので、印は控えめでよい。
 */
const AVATAR_SIZE = "1.25rem";

/** 印の中心を 1 行目の文字の中心に合わせるための微調整 */
const AVATAR_NUDGE_Y = "0.05rem";

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
      白地はカードとしてまとめて敷かず、担当の語ごとに敷いている（下の bg-white）。
      サイドバーの他の値も文字幅ぴったりの白地なので、そちらと揃う。
      カードにすると、一人だけの案件で右側が大きく空いて未完成に見えた。
    */
    <ul className="m-0 flex w-fit max-w-full list-none flex-col gap-3 rounded-[16px] mt-4">
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

          {/*
            overflow-wrap:anywhere を親に置くのが要点。break-keep だけだと、
            サイドバーが最も狭くなる 768px（タブレット縦）で
            「フロントエンド実装（Cursor）」が 1 語のまま横にはみ出す。
          */}
          <span className="min-w-0 font-sans text-[13px] leading-[1.6] tracking-[0.04em] text-[#333] [overflow-wrap:anywhere]">
            <span className="break-keep">
              {member.label}
              {/* 1 人のときは付けない（「× 1」はノイズにしかならない） */}
              {member.count && member.count > 1 ? (
                <span className="text-[#546e7a]">{` × ${member.count}`}</span>
              ) : null}
            </span>
            {/*
              自分の行にだけ担当を続ける。全角の空きで区切ると、折り返したときに
              名前と担当が地続きに見えてしまうので、別の要素にして間隔を持たせる。
            */}
            {member.self && roles.length ? (
              <span className="ml-3">
                {/*
                  役割ごとに break-keep で包み、区切りの空白を優先的な折り返し位置にする。
                  素の 1 文字列にすると和文はどこでも改行でき、「ライティング」が
                  「ライティン／グ」のように 1 文字だけ次行に落ちる。収まりきらない
                  場合だけ親の overflow-wrap で折れるので、はみ出しはしない。
                  白地は box-decoration-clone で行ごとに切る（既定だと 1 枚の面になる）。
                */}
                {roles.map((role, r) => (
                  <span key={role}>
                    <span className="box-decoration-clone break-keep bg-white">{role}</span>
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
