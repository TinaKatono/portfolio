import { workDetails } from "./workDetails";

import kiviaqImg_2 from "../assets/works/kiviaq/kiviaq_2.webp";
import saikaiImg_1 from "../assets/works/works_3/works_3_1.webp";

import recprImg from "../assets/works/works_2/works_2_1.webp";

export type WorkItem = {
  id: string;
  title: string;
  /** 一覧サムネイル（案件ごとに画像パスや URL を差し替え） */
  thumbSrc: string;
  /** ホバー時に表示する役割・担当領域（カンマ区切りで1行表示） */
  roles: string[];
};

/** 一覧に出す順序とサムネのみ。タイトル・roles は workDetails から同期 */
const workItemThumbs: { id: string; thumbSrc: string }[] = [
  { id: "kiviaq-pharmacy", thumbSrc: kiviaqImg_2 },
  { id: "saikai-matsunaga", thumbSrc: saikaiImg_1 },
  // { id: "fadila-oil", thumbSrc: sample1Img },
  { id: "recpr", thumbSrc: recprImg },
  // { id: "task-holdings", thumbSrc: sample1Img },
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
