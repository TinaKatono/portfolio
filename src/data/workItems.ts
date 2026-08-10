import { workDetails } from "./workDetails";

import work1Img from "../assets/works/work_1/work_1_1.webp";
import work3Img from "../assets/works/work_3/work_3_2.webp";
import work4Img from "../assets/works/work_4/work_4_1.webp";

import work2Img from "../assets/works/work_2/work_2_5.webp";
import work5Img from "../assets/works/work_5/work_5_2.webp";
import work6Img from "../assets/works/work_6/work_6_1.webp";

export type WorkItem = {
  id: string;
  title: string;
  /** 一覧サムネイル（案件ごとに画像パスや URL を差し替え。未指定ならプレースホルダー表示） */
  thumbSrc?: string;
  /** ホバー時に表示する役割・担当領域（カンマ区切りで1行表示） */
  roles: string[];
};

/** 一覧に出す順序とサムネのみ。タイトル・roles は workDetails から同期 */
/*
  並び順は時系列ではなく「読まれる順に効く順」で決めている。
  work_1 … 公開中のクライアント案件（ブランドサイト）。書体選定の理由まで
           書いてあり、「クライアント案件を回せるか」という最初の疑問をここで消す
  work_2 … 画像点数が最多で視覚情報量が最大。企画から実装まで一人
  work_3 … 思考の深さが伝わるが画像が 1 枚なので、文章を読む人に届く位置に
  work_4 … 手堅いクライアントワーク。公開中でリンクも踏める
  work_5 … 画像が薄い。インタビュー記事が付けば位置を上げてよい
  work_6 … ABOUT の「キャリアはアパレル EC の実装から」と呼応する原点。
           一覧を遡ると出自に着く締めとして最後に置く

  **id は掲載順に振ってある。並べ替えるときは URL も変わる点に注意**
  （既に共有した URL があるなら、id は据え置いて配列の順序だけ入れ替える）。
*/
const workItemThumbs: { id: string; thumbSrc?: string }[] = [
  { id: "work_1", thumbSrc: work1Img },
  { id: "work_2", thumbSrc: work2Img },
  { id: "work_3", thumbSrc: work3Img },
  { id: "work_4", thumbSrc: work4Img },
  { id: "work_5", thumbSrc: work5Img },
  // 実サイトは掲載できないので、案件を一語で示すキーカードを用意した
  { id: "work_6", thumbSrc: work6Img },
];

export const workItems: WorkItem[] = workItemThumbs.map(({ id, thumbSrc }) => {
  const detail = workDetails[id];
  if (!detail) {
    throw new Error(`[workItems] workDetails に id がありません: ${id}`);
  }
  return {
    id,
    thumbSrc,
    title: detail.title,
    roles: [...detail.roles],
  };
});
