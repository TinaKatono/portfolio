import kiviaqGallery1 from "../assets/works/kiviaq/kiviaq_1.webp";

import recprGallery1 from "../assets/works/works_2/works_2_1.webp";

import saikaiGallery1 from "../assets/works/works_3/works_3_1.webp";
import saikaiGallery2 from "../assets/works/works_3/works_3_2.webp";
import saikaiGallery3 from "../assets/works/works_3/works_3_3.webp";

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
  /** 詳細右カラムのビジュアル（上から順。sections[i] の上に対応、余りはテキストブロックの下に続く） */
  galleryImages?: string[];
};

/**
 * 各案件の詳細。文言・期間・ツールは後から差し替え前提のプレースホルダを含みます。
 */
export const workDetails: Record<string, WorkDetail> = {
  "kiviaq-pharmacy": {
    title: "Integrated Medical Supply Chain UX",
    titleJa: "医療サプライチェーンのUX・情報設計",
    roles: ["UI Design", "UX Design", "Information Architecture"],
    yearDuration: "2025/07 - 2025/10",
    tools: ["Figma"],
    galleryImages: [kiviaqGallery1,],
    sections: [
      {
        ja: "薬局DXサービスの新規立ち上げに、PM補佐兼UI/UXデザイナーとして参画しました。患者向けLINEミニアプリ・薬局スタッフ向け管理画面・配送業者向けモバイルアプリの3システムにまたがる複雑な業務フローを対象に、要件定義から画面設計までをリード。特に薬機法等の法的観点や現場運用の制約を深く読み解き、初期の要望を単に形にするだけでなく、データの流動性や例外分岐、そして現場で実際に機能する運用までを見据えたUX設計を徹底しました。\n\nシステム間の矛盾を早期に検知するため、全体の分岐を網羅するシーケンス図を作成し、実装・運用の共通言語として活用。制約が多い中でもUIとして破綻しない構造を追求し、特に管理画面領域では、運用者の判断を妨げない情報設計に注力しました。タイトなスケジュールの中、業界知識を短期で吸収しながら要件精査とプロトタイプ作成を行い、無事納期内リリースを実現できました。",
        en: "I joined the launch of a new medical product as a PM Associate and Lead UI/UX Designer, overseeing the end-to-end design process for a complex ecosystem spanning three interconnected platforms: a patient-facing LINE Mini-app, a pharmacy administration dashboard, and a courier mobile app. Navigating the stringent requirements of pharmaceutical regulations and real-world operational constraints, I focused on creating a UX that transcends mere visual representation—meticulously addressing data flows, edge-case logic, and feasible on-site workflows. \n\nTo ensure seamless integration across the three systems, I developed comprehensive sequence diagrams that served as a universal language for developers and stakeholders, allowing us to resolve logical conflicts early in the process. Within a high-pressure timeline, I rapidly mastered domain-specific knowledge to bridge the gap between complex requirements and intuitive interface design, ultimately delivering a refined prototype and securing an on-time product launch.",
      },
      // {
    //     ja: "システム間の矛盾を早期に検知するため、全体の分岐を網羅するシーケンス図を作成し、実装・運用の共通言語として活用。制約が多い中でもUIとして破綻しない構造を追求し、特に管理画面領域では、運用者の判断を妨げない情報設計に注力しました。タイトなスケジュールの中、業界知識を短期で吸収しながら要件精査とプロトタイプ作成を行い、無事納期内リリースを実現できました。",
    //     en: "To ensure seamless integration across the three systems, I developed comprehensive sequence diagrams that served as a universal language for developers and stakeholders, allowing us to resolve logical conflicts early in the process. Within a high-pressure timeline, I rapidly mastered domain-specific knowledge to bridge the gap between complex requirements and intuitive interface design, ultimately delivering a refined prototype and securing an on-time product launch.",
    //   },
    ],
  },

  "saikai-matsunaga": {
    title: "Corporate Website for a Construction Company",
    titleJa: "建設会社のコーポレートサイト作成",
    roles: ["UI Design", "Writing", "Frontend Dev(Cursor)"],
    yearDuration: "2024/03 - 2024/09",
    tools: ["Figma", "Cursor"],
    galleryImages: [saikaiGallery1, saikaiGallery2, saikaiGallery3],
    sections: [
      {
        ja: "長崎県西海市を中心に、砂防工事や道路舗装などの公共事業を担う建設会社様のコーポレートサイトリニューアルに参画し、トーン＆マナーの整理から画面設計、ライティングや実装・公開まで一貫して担当しました。写真とタイポグラフィのバランス、ストーリーとして読める構成を重視し、静的ページ中心ながらも没入感のある体験になるよう調整しています。",
        en: "I participated in the corporate website renewal for a general construction company that handles public works, such as erosion control and road paving, primarily in Saikai City, Nagasaki. I was responsible for the entire process—from defining the visual tone and manner to wireframing, copywriting, implementation, and launch. By balancing photography with typography and focusing on a narrative-driven structure, I ensured an immersive user experience despite the site’s static nature.",
      },
      {
        ja: "クライアント様のご希望が、「採用面を踏まえ、やさしく明るく、親しみの持てる雰囲気に」ということで、起業カラーであるブルーとグリーンを柔らかく調整し、自然豊かな西海市の雰囲気に沿うような雰囲気をご提案しました。実装面ではコンポーネント単位で再利用しやすい構造にしました。",
        en: "To meet the client’s request for a gentle, bright, and approachable feel to support their recruitment efforts, I softened their corporate blue and green palette to harmonize with the lush, natural environment of Saikai City. On the technical side, I built the site using a component-based architecture to ensure a highly reusable and maintainable structure.",
      },
    ],
  },

  // "fadila-oil": {
  //   title: "FADILA OIL",
  //   titleJa: "ファディラ オイル（仮）",
  //   roles: ["UI Design", "UX Design", "Frontend Dev(Cursor)"],
  //   yearDuration: "2023/11 - 2024/04",
  //   tools: ["Figma", "Cursor", "Notion"],
  //   sections: [
  //     {
  //       ja: "ブランドの世界観を伝えるプロモーションサイトのUI/UX設計と実装を担当。商品ラインごとのストーリーを軸に、スクロール体験とビジュアルの切り替えタイミングを設計しました。（仮の説明文です。）",
  //       en: "Placeholder: promotional web experience, scroll-driven layout, and brand storytelling. Replace with final copy.",
  //     },
  //     {
  //       ja: "モバイル閲覧を前提に、画像の最適化とタイポの可読性を調整。プロトタイプで関係者レビューを回し、文言とレイアウトを反復しました。（仮）",
  //       en: "Placeholder: mobile-first tuning and stakeholder reviews via prototype. Update in workDetails.ts later.",
  //     },
  //   ],
  // },

  recpr: {
    title: "Recruitment Media & Management System",
    titleJa: "採用メディアと管理システムの開発設計",
    roles: ["UI Design", "UX Design", "Information Architecture"],
    yearDuration: "2024/06 - 2025/01",
    tools: ["Figma", "FigJam"],
    galleryImages: [recprGallery1],
    sections: [
      {
        ja: "採用領域のメディアプロダクト（ユーザー向けサイト＋企業向け管理画面）の新規開発に、PM補佐兼UI/UXデザイナーとして参画しました。求人・企業・記事など複数のコンテンツを扱う構造のため、単発の画面作成ではなく、検索/絞り込み・回遊・編集運用まで含めた体験設計と、段階的な拡張を前提にした情報設計が求められるプロジェクトでした。\n開発中は、クライアント検収で出たフィードバックを起点に、要望をそのまま反映するのではなく、「今のフェーズでの最適解」と「後続フェーズで条件が増えたときに破綻しない構造」の両立を重視。たとえば絞り込みUIでは、将来的に条件が増える前提で煩雑化を避けるUIを提案し、PC/スマホそれぞれの見え方や運用上の懸念も踏まえて意思決定まで落とし込みました。\n\nまた、管理画面と運用時に発生する運用ストレス（プレビュー確認のために行き来が必要になる等）に対して、表示ルールや画像の扱いを整理し、運用者が迷わない仕様に調整。またビジュアルデザイン面では、要望が細部まで具体的で意思決定が揺れやすい状況だったため、案の比較軸（ユーザー影響・運用・拡張性・実装負荷）を揃えて合意形成を進め、手戻りしにくい進め方を整えました。\n\n結果として、検収FBを吸収しながらユーザー体験と運用体験の両面で効率の良い仕様に収束させ、リリースに向けた開発を前進させました。\nまた、管理画面と運用時に発生する運用ストレス（プレビュー確認のために行き来が必要になる等）に対して、表示ルールや画像の扱いを整理し、運用者が迷わない仕様に調整。またビジュアルデザイン面では、要望が細部まで具体的で意思決定が揺れやすい状況だったため、案の比較軸（ユーザー影響・運用・拡張性・実装負荷）を揃えて合意形成を進め、手戻りしにくい進め方を整えました。\n結果として、検収FBを吸収しながらユーザー体験と運用体験の両面で効率の良い仕様に収束させ、リリースに向けた開発を前進させました。",
        en:"I joined the development of a new recruitment media platform—encompassing both the user-facing site and the corporate administration dashboard—as a PM Associate and Lead UI/UX Designer. The project involved a complex structure handling various content types, including job listings, company profiles, and articles, requiring an information architecture designed for seamless navigation, advanced filtering, and long-term scalability.\n\nThroughout the development phase, I prioritized balancing immediate solutions with future-proof structures. For example, when designing the filtering UI, I proposed a system that remains intuitive even as additional parameters are added in subsequent phases, carefully aligning the cross-device experience with operational feasibility.\n\nFurthermore, I focused on optimizing the administrative experience by streamlining complex rules for content management and preview workflows to eliminate operational friction. To navigate high-fidelity feedback and evolving requirements from the client, I established a clear evaluation framework based on user impact, scalability, and implementation cost. This structured approach facilitated decisive consensus-building, minimized rework, and successfully advanced the project toward its release by converging user and operational experiences into a highly efficient specification."
      },
      // {
      //   ja: "コンテンツ量の変動に耐えられるモジュール型レイアウトを提案し、運用チームが更新しやすいガイドラインを簡易版でまとめました。（仮）",
      //   en: "Placeholder: modular layout and lightweight guidelines for editors. Edit in data file when content is ready.",
      // },
    ],
  },

  // "task-holdings": {
  //   title: "TASK HOLDINGS",
  //   titleJa: "タスクホールディングス（仮）",
  //   roles: ["UX Design", "No-code Dev(Studio)"],
  //   yearDuration: "2025/02 - 2025/05",
  //   tools: ["Figma", "Studio"],
  //   sections: [
  //     {
  //       ja: "ノーコードツールを用いたランディングの構成設計とビルドを担当。施策ごとのセクション追加がしやすいよう、ブロックの粒度と命名ルールを揃えました。（仮の説明）",
  //       en: "Placeholder: no-code landing build in Studio, block structure and naming for marketing iterations.",
  //     },
  //     {
  //       ja: "計測タグの配置やフォーム導線を整理し、社内の運用フローに合わせたマニュアルを共有しました。（後で差し替え）",
  //       en: "Placeholder: analytics hooks, form flows, and handoff notes. Replace both languages when finalized.",
  //     },
  //   ],
  // },
};

export function hasWorkDetail(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(workDetails, id);
}
