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

/**
 * 各案件の詳細。文言・期間・ツールは後から差し替え前提のプレースホルダを含みます。
 */
export const workDetails: Record<string, WorkDetail> = {
  "kiviaq-pharmacy": {
    title: "Kiviaq pharmacy",
    titleJa: "キビヤックファーマシー",
    roles: ["UI Design", "UX Design", "Information Architecture"],
    yearDuration: "2025/07 - 2025/10",
    tools: ["Figma"],
    sections: [
      {
        ja: "薬局DXサービスの新規立ち上げに、PM補佐兼UI/UXデザイナーとして参画しました。患者向けLINEミニアプリ・薬局スタッフ向け管理画面・配送業者向けモバイルアプリの3システムにまたがる複雑な業務フローを対象に、要件定義から画面設計までをリード。特に薬機法等の法的観点や現場運用の制約を深く読み解き、初期の要望を単に形にするだけでなく、データの流動性や例外分岐、そして現場で実際に機能する運用までを見据えたUX設計を徹底しました。",
        en: "I joined the launch of a new medical product as a PM Associate and Lead UI/UX Designer, overseeing the end-to-end design process for a complex ecosystem spanning three interconnected platforms: a patient-facing LINE Mini-app, a pharmacy administration dashboard, and a courier mobile app. Navigating the stringent requirements of pharmaceutical regulations and real-world operational constraints, I focused on creating a UX that transcends mere visual representation—meticulously addressing data flows, edge-case logic, and feasible on-site workflows.",
      },
      {
        ja: "システム間の矛盾を早期に検知するため、全体の分岐を網羅するシーケンス図を作成し、実装・運用の共通言語として活用。制約が多い中でもUIとして破綻しない構造を追求し、特に管理画面領域では、運用者の判断を妨げない情報設計に注力しました。タイトなスケジュールの中、業界知識を短期で吸収しながら要件精査とプロトタイプ作成を行い、無事納期内リリースを実現できました。",
        en: "To ensure seamless integration across the three systems, I developed comprehensive sequence diagrams that served as a universal language for developers and stakeholders, allowing us to resolve logical conflicts early in the process. Within a high-pressure timeline, I rapidly mastered domain-specific knowledge to bridge the gap between complex requirements and intuitive interface design, ultimately delivering a refined prototype and securing an on-time product launch.",
      },
    ],
  },

  "saikai-matsunaga": {
    title: "SAIKAI MATSUNAGA",
    titleJa: "サイカイ・マツナガ（仮）",
    roles: ["UI Design", "Writing", "Frontend Dev(Cursor)"],
    yearDuration: "2024/03 - 2024/09",
    tools: ["Figma", "Cursor"],
    sections: [
      {
        ja: "地域ブランドのコーポレートサイトリニューアルに参画し、トーン＆マナーの整理から画面設計、ライティングまで一貫して担当しました。写真とタイポグラフィのバランス、ストーリーとして読める構成を重視し、静的ページ中心ながらも没入感のある体験になるよう調整しています。（本文は後日差し替え予定です。）",
        en: "Placeholder copy for this project: corporate site renewal, UI design, writing, and front-end implementation. Replace this paragraph with the final English narrative when ready.",
      },
      {
        ja: "デザインシステムの下地となるタイポスケールとカラールールを定義し、実装ではコンポーネント単位で再利用しやすい構造にしました。アクセシビリティ面の見出し階層やコントラストもレビュー済みです。（仮テキスト）",
        en: "Second block placeholder: design tokens, component structure, and accessibility notes. Edit both Japanese and English in workDetails.ts.",
      },
    ],
  },

  "fadila-oil": {
    title: "FADILA OIL",
    titleJa: "ファディラ オイル（仮）",
    roles: ["UI Design", "UX Design", "Frontend Dev(Cursor)"],
    yearDuration: "2023/11 - 2024/04",
    tools: ["Figma", "Cursor", "Notion"],
    sections: [
      {
        ja: "ブランドの世界観を伝えるプロモーションサイトのUI/UX設計と実装を担当。商品ラインごとのストーリーを軸に、スクロール体験とビジュアルの切り替えタイミングを設計しました。（仮の説明文です。）",
        en: "Placeholder: promotional web experience, scroll-driven layout, and brand storytelling. Replace with final copy.",
      },
      {
        ja: "モバイル閲覧を前提に、画像の最適化とタイポの可読性を調整。プロトタイプで関係者レビューを回し、文言とレイアウトを反復しました。（仮）",
        en: "Placeholder: mobile-first tuning and stakeholder reviews via prototype. Update in workDetails.ts later.",
      },
    ],
  },

  recpr: {
    title: "RECPR",
    titleJa: "レックピーアール（仮）",
    roles: ["UI Design", "UX Design", "Information Architecture"],
    yearDuration: "2024/06 - 2025/01",
    tools: ["Figma", "FigJam"],
    sections: [
      {
        ja: "情報設計を中心に、複数ペルソナ向けの導線と検索性の改善プロジェクトに参加。サイトマップの再定義、主要タスクのフロー図、ワイヤーからUIまでを担当しました。（ダミーテキスト）",
        en: "Placeholder: IA-led redesign, sitemap and user flows, wireframes to UI. Replace with project-specific English.",
      },
      {
        ja: "コンテンツ量の変動に耐えられるモジュール型レイアウトを提案し、運用チームが更新しやすいガイドラインを簡易版でまとめました。（仮）",
        en: "Placeholder: modular layout and lightweight guidelines for editors. Edit in data file when content is ready.",
      },
    ],
  },

  "task-holdings": {
    title: "TASK HOLDINGS",
    titleJa: "タスクホールディングス（仮）",
    roles: ["UX Design", "No-code Dev(Studio)"],
    yearDuration: "2025/02 - 2025/05",
    tools: ["Figma", "Studio"],
    sections: [
      {
        ja: "ノーコードツールを用いたランディングの構成設計とビルドを担当。施策ごとのセクション追加がしやすいよう、ブロックの粒度と命名ルールを揃えました。（仮の説明）",
        en: "Placeholder: no-code landing build in Studio, block structure and naming for marketing iterations.",
      },
      {
        ja: "計測タグの配置やフォーム導線を整理し、社内の運用フローに合わせたマニュアルを共有しました。（後で差し替え）",
        en: "Placeholder: analytics hooks, form flows, and handoff notes. Replace both languages when finalized.",
      },
    ],
  },
};

export function hasWorkDetail(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(workDetails, id);
}
