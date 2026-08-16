import { MARK_IMAGE_BLUE_EYES } from "./brand";
import type { WorkMember } from "../data/workDetails";

/**
 * 自分の印の直径。1 行目の文字の高さ（13px × 1.6 ≒ 21px）とほぼ同じ。
 */
const SELF_SIZE = "1.25rem";

/**
 * 他のメンバーの丸の直径。自分の印より一回り小さくして、
 * 並んだときに自分の行が沈まないようにしている。
 */
const OTHER_SIZE = "1rem";

/**
 * 印を置く枠。**幅と高さを固定するのが要点。**
 * 自分と他のメンバーで印の寸法が違うので、枠なしで並べると
 * 行ごとに役割名の開始位置がずれる。高さは 1 行目の文字の高さに合わせてあり、
 * 中央寄せにしておけば寸法を変えても縦位置の微調整が要らない。
 */
const AVATAR_BOX = "flex h-[1.3rem] w-5 shrink-0 items-center justify-center";

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
          <span className={AVATAR_BOX} aria-hidden="true">
            {member.self ? (
              <img
                src={MARK_IMAGE_BLUE_EYES}
                alt=""
                className="block object-contain"
                style={{ width: SELF_SIZE, height: SELF_SIZE }}
              />
            ) : (
              <span
                className="block rounded-full bg-[#b0bec5]"
                style={{ width: OTHER_SIZE, height: OTHER_SIZE }}
              />
            )}
          </span>

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
