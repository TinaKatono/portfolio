import { workDetails } from "./workDetails";

import sachiImg from "../assets/works/sachi-art-work/sachi_1.webp";
import kiviaqImg_2 from "../assets/works/kiviaq/kiviaq_2.webp";
import saikaiImg_1 from "../assets/works/works_3/works_3_1.webp";

import campaiImg from "../assets/works/campai/campai_1.webp";

export type WorkItem = {
  id: string;
  title: string;
  /** 一覧サムネイル（案件ごとに画像パスや URL を差し替え。未指定ならプレースホルダー表示） */
  thumbSrc?: string;
  /** ホバー時に表示する役割・担当領域（カンマ区切りで1行表示） */
  roles: string[];
};

/** 一覧に出す順序とサムネのみ。タイトル・roles は workDetails から同期 */
const workItemThumbs: { id: string; thumbSrc?: string }[] = [
  { id: "sachi-art-work", thumbSrc: sachiImg },
  { id: "kiviaq-pharmacy", thumbSrc: kiviaqImg_2 },
  { id: "saikai-matsunaga", thumbSrc: saikaiImg_1 },
  // { id: "fadila-oil", thumbSrc: sample1Img },
  // サムネイル未設定（掲載を取り下げたメインビジュアルと同一画像だったため）
  { id: "recpr" },
  { id: "campai", thumbSrc: campaiImg },
  // サムネイル未設定（クライアント案件のため掲載可能な画像がない）。一覧ではプレースホルダー枠になる
  { id: "apparel-ec-frontend" },
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
