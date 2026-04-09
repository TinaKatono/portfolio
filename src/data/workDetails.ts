export type WorkDetailSection = {
  ja: string;
  en: string;
};

export type WorkDetail = {
  title: string;
  titleJa: string;
  roles: string[];
  yearDuration: string;
  tools: string[];
  sections: WorkDetailSection[];
};

export const workDetails: Record<string, WorkDetail> = {
  "kiviaq-pharmacy": {
    title: "Kiviaq pharmacy",
    titleJa: "キビヤックファーマシー",
    roles: ["UI Design", "UX Design", "Information Architecture"],
    yearDuration: "2025/07 - 2025/10",
    tools: ["Figma"],
    sections: [
      {
        ja: "医療（薬）領域の新規プロダクト立ち上げに、PM補佐兼UI/UXデザイナーとして参画しました。患者向けLINEミニアプリ・薬局スタッフ向け管理画面・配送業者向けモバイルアプリの3システムにまたがる複雑な業務フローを対象に、要件定義から画面設計までをリード。特に薬機法等の法的観点や現場運用の制約を深く読み解き、初期の要望を単に形にするだけでなく、データの流動性や例外分岐、そして現場で実際に機能する運用までを見据えたUX設計を徹底しました。",
        en: "I joined the launch of a new medical product as a PM Associate and Lead UI/UX Designer, overseeing the end-to-end design process for a complex ecosystem spanning three interconnected platforms: a patient-facing LINE Mini-app, a pharmacy administration dashboard, and a courier mobile app. Navigating the stringent requirements of pharmaceutical regulations and real-world operational constraints, I focused on creating a UX that transcends mere visual representation—meticulously addressing data flows, edge-case logic, and feasible on-site workflows.",
      },
      {
        ja: "システム間の矛盾を早期に検知するため、全体の分岐を網羅するシーケンス図を作成し、実装・運用の共通言語として活用。制約が多い中でもUIとして破綻しない構造を追求し、特に管理画面領域では、運用者の判断を妨げない情報設計に注力しました。タイトなスケジュールの中、業界知識を短期で吸収しながら要件精査とプロトタイプ作成を行い、無事納期内リリースを実現できました。",
        en: "To ensure seamless integration across the three systems, I developed comprehensive sequence diagrams that served as a universal language for developers and stakeholders, allowing us to resolve logical conflicts early in the process. Within a high-pressure timeline, I rapidly mastered domain-specific knowledge to bridge the gap between complex requirements and intuitive interface design, ultimately delivering a refined prototype and securing an on-time product launch.",
      },
    ],
  },
};

export function hasWorkDetail(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(workDetails, id);
}
