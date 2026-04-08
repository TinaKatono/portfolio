import sample1Img from "../assets/sample_1.jpg";

export type WorkItem = {
  id: string;
  title: string;
  /** 一覧サムネイル（案件ごとに画像パスや URL を差し替え） */
  thumbSrc: string;
};

/**
 * RECENT WORK 一覧のデータ。画像は thumbSrc を差し替えるだけで入れ替え可能。
 */
export const workItems: WorkItem[] = [
  { id: "kiviaq-pharmacy", title: "kiviaq pharmacy", thumbSrc: sample1Img },
  { id: "saikai-matsunaga", title: "SAIKAI MATSUNAGA", thumbSrc: sample1Img },
  { id: "fadila-oil", title: "FADILA OIL", thumbSrc: sample1Img },
  { id: "recpr", title: "RECPR", thumbSrc: sample1Img },
  { id: "task-holdings", title: "TASK HOLDINGS", thumbSrc: sample1Img },
];
