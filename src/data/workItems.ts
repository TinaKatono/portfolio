import sample1Img from "../assets/pf_2.webp";
import { hasWorkDetail } from "./workDetails";

export type WorkItem = {
  id: string;
  title: string;
  /** 一覧サムネイル（案件ごとに画像パスや URL を差し替え） */
  thumbSrc: string;
  /** ホバー時に表示する役割・担当領域（カンマ区切りで1行表示） */
  roles: string[];
};

/**
 * RECENT WORK 一覧のデータ。画像は thumbSrc を差し替えるだけで入れ替え可能。
 */
export const workItems: WorkItem[] = [
  {
    id: "kiviaq-pharmacy",
    title: "kiviaq pharmacy",
    thumbSrc: sample1Img,
    roles: ["UI Design", "UX Design", "Information Architecture"],
  },
  {
    id: "saikai-matsunaga",
    title: "SAIKAI MATSUNAGA",
    thumbSrc: sample1Img,
    roles: ["UI Design", "Writing", "Frontend Dev(Cursor)"],
  },
  {
    id: "fadila-oil",
    title: "FADILA OIL",
    thumbSrc: sample1Img,
    roles: ["UI Design", "UX Design", "Frontend Dev(Cursor)"],
  },
  {
    id: "recpr",
    title: "RECPR",
    thumbSrc: sample1Img,
    roles: ["UI Design", "UX Design", "Information Architecture"],
  },
  {
    id: "task-holdings",
    title: "TASK HOLDINGS",
    thumbSrc: sample1Img,
    roles: ["UX Design", "No-code Dev(Studio)"],
  },
];

if (import.meta.env.DEV) {
  for (const item of workItems) {
    if (!hasWorkDetail(item.id)) {
      console.warn(`[workItems] workDetails に id がありません（一覧から詳細へリンクできません）: ${item.id}`);
    }
  }
}
