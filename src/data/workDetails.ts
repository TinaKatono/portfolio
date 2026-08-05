import kiviaqGallery1 from "../assets/works/kiviaq/kiviaq_1.webp";

import recprGallery1 from "../assets/works/works_2/works_2_1.webp";

import saikaiGallery1 from "../assets/works/works_3/works_3_1.webp";

import campaiGallery1 from "../assets/works/campai/campai_1.webp";
import campaiGallery2 from "../assets/works/campai/campai_2.webp";
import campaiGallery3 from "../assets/works/campai/campai_3.webp";
import campaiGallery4 from "../assets/works/campai/campai_4.webp";
import saikaiGallery2 from "../assets/works/works_3/works_3_2.webp";
import saikaiGallery3 from "../assets/works/works_3/works_3_3.webp";

import sachiGallery1 from "../assets/works/sachi-art-work/sachi_1.webp";
import sachiGallery2 from "../assets/works/sachi-art-work/sachi_2.webp";
import sachiGallery3 from "../assets/works/sachi-art-work/sachi_3.webp";

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
  /**
   * 公開中サイトへのリンク（詳細ページに VISIT SITE ボタンが出る）。
   *
   * **設定するのは「公開が明示的に問題ない案件」だけ。** 管理画面主体・NDA・
   * 未公開の案件には付けない（未指定ならボタン自体が出ない）。
   * リンク先が別デザインへ改修されると実績として成立しなくなるので、
   * 案件を足したときや久しぶりに見直したときは生きているか確認すること。
   */
  siteUrl?: string;
};

/**
 * 各案件の詳細。文言・期間・ツールは後から差し替え前提のプレースホルダを含みます。
 */
export const workDetails: Record<string, WorkDetail> = {
  "sachi-art-work": {
    title: "Brand Website for a Creative Atelier",
    titleJa: "ファッションアトリエのブランドサイト制作",
    roles: ["UI Design", "UX Design", "Writing", "Frontend Dev(Cursor)"],
    // TODO: 実際の制作期間に差し替え（ヒアリング開始〜納品で約2週間）
    yearDuration: "2026/07 - 2026/08",
    tools: ["Figma", "Next.js", "Cursor"],
    galleryImages: [sachiGallery1, sachiGallery2, sachiGallery3],
    siteUrl: "https://www.sachiaw.com/",
    sections: [
      {
        ja: "仲介会社を介してご依頼いただいた、ファッションアトリエのブランドサイト新規制作です。ヒアリングからデザイン、コピーライティング、実装、素材選定、公開作業までを一人で担当しました。\n\nヒアリング開始から納品までおよそ2週間という短い期間だったため、Figmaではワイヤーフレームと簡易のデザインサンプルまでを固め、その段階で実装に着手。以降はデザインと実装を並行させ、静的なカンプではなく実画面でご確認いただく進め方に切り替えました。カンプの往復を減らし、限られた時間を体験の質そのものに充てることを優先した判断です。",
        en: "A new brand website for a fashion atelier, commissioned through an agency. I owned the entire process on my own—from the initial hearing to design, copywriting, implementation, asset selection, and launch.\n\nWith roughly two weeks from the first hearing to delivery, I locked only the wireframes and light design samples in Figma before moving into implementation. From there I ran design and build in parallel, reviewing on live screens rather than static mockups. Cutting down the round trips on comps let me spend the limited time on the quality of the experience itself.",
      },
      {
        ja: "想定読者は、50代以上の落ち着いた審美眼を持つ女性層です。ファッションを趣味として深く愛する方から、自身の表現やブランドづくりに踏み出そうとする方まで、いずれも「上質さ」に対する目が厳しい層だと捉え、ラグジュアリーでありながら気負わせない、アトリエの空気感を軸にトーンを設計しました。\n\n書体は、欧文の見出しに Antic Didone、和文に Zen Old Mincho を選定しています。Antic Didone は縦画と横画のコントラストが強いディドネ様式のセリフ体で、モード誌のロゴが長く用いてきた系譜にあり、「Beyond the Surface.」のような短い言葉に品格と緊張感を与えます。和文には骨格に古典の面持ちを残すオールド明朝を合わせ、字間と行間をゆるやかに開くことで、読ませる文章にも余白の効いた静けさを持たせました。装飾を足すのではなく、書体と余白で格をつくることを意図しています。",
        en: "The intended audience is women aged fifty and above with a settled, discerning eye—from those who love fashion deeply as a lifelong interest to those stepping into building an expression or a brand of their own. Assuming a readership with high standards for quality, I built the tone around the atmosphere of an atelier: luxurious, yet never intimidating.\n\nFor type, I chose Antic Didone for the Latin headings and Zen Old Mincho for the Japanese. Antic Didone is a Didone serif with sharp thick-to-thin contrast, part of the lineage long used by fashion magazine mastheads, lending poise and tension to a phrase as short as \"Beyond the Surface.\" For Japanese, an old-style Mincho with classical bones is paired with generous letter- and line-spacing, so that even longer passages keep a quiet, well-spaced calm. The intent was to build a sense of formality through typeface and negative space rather than added ornament.",
      },
      {
        ja: "「Beyond the Surface.（表層を超えて）」をはじめとするコピーは、ブランドの思想である「構造から、思想から、すべてをデザインする」という考え方を一語で受け止められる言葉を探すところから設計しました。案出しには生成AIを併用し、ブランドの温度に合うものを選び取ったうえで、語感と字数を整えています。クライアント提供の写真以外のビジュアルもこちらで選定し、素材・光・余白のトーンをサイト全体で揃えました。\n\n実装はCursorを中心に進め、タイポグラフィの詰めや余白の微調整といった精度が要る部分は手作業でコーディングしています。短期集中の進行でしたが、最終的にクライアントからは「想像していたよりかなりクオリティが高い」とのお言葉をいただきました。",
        en: "The copy, including \"Beyond the Surface.\", started from the search for words that could hold the brand's own philosophy—designing everything from structure and from thought—in a single line. I used generative AI to widen the pool of candidates, then selected what matched the brand's temperature and tuned the wording and length. Every visual beyond the client-supplied photography was also sourced on my side, aligning material, light, and negative space across the whole site.\n\nImplementation ran primarily in Cursor, with the parts that demand precision—typographic tightening, fine adjustments to spacing—hand-coded. Despite the intensive schedule, the client's closing feedback was that the quality was \"far higher than they had imagined.\"",
      },
    ],
  },

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
        ja: "採用領域のメディアプロダクト（ユーザー向けサイト＋企業向け管理画面）の新規開発に、PM補佐兼UI/UXデザイナーとして参画しました。求人・企業・記事など複数のコンテンツを扱う構造のため、単発の画面作成ではなく、検索/絞り込み・回遊・編集運用まで含めた体験設計と、段階的な拡張を前提にした情報設計が求められるプロジェクトでした。\n開発中は、クライアント検収で出たフィードバックを起点に、要望をそのまま反映するのではなく、「今のフェーズでの最適解」と「後続フェーズで条件が増えたときに破綻しない構造」の両立を重視。たとえば絞り込みUIでは、将来的に条件が増える前提で煩雑化を避けるUIを提案し、PC/スマホそれぞれの見え方や運用上の懸念も踏まえて意思決定まで落とし込みました。\n\nまた、管理画面と運用時に発生する運用ストレス（プレビュー確認のために行き来が必要になる等）に対して、表示ルールや画像の扱いを整理し、運用者が迷わない仕様に調整。またビジュアルデザイン面では、要望が細部まで具体的で意思決定が揺れやすい状況だったため、案の比較軸（ユーザー影響・運用・拡張性・実装負荷）を揃えて合意形成を進め、手戻りしにくい進め方を整えました。\n\n結果として、検収FBを吸収しながらユーザー体験と運用体験の両面で効率の良い仕様に収束させ、リリースに向けた開発を前進させました。",
        en:"I joined the development of a new recruitment media platform—encompassing both the user-facing site and the corporate administration dashboard—as a PM Associate and Lead UI/UX Designer. The project involved a complex structure handling various content types, including job listings, company profiles, and articles, requiring an information architecture designed for seamless navigation, advanced filtering, and long-term scalability.\n\nThroughout the development phase, I prioritized balancing immediate solutions with future-proof structures. For example, when designing the filtering UI, I proposed a system that remains intuitive even as additional parameters are added in subsequent phases, carefully aligning the cross-device experience with operational feasibility.\n\nFurthermore, I focused on optimizing the administrative experience by streamlining complex rules for content management and preview workflows to eliminate operational friction. To navigate high-fidelity feedback and evolving requirements from the client, I established a clear evaluation framework based on user impact, scalability, and implementation cost. This structured approach facilitated decisive consensus-building, minimized rework, and successfully advanced the project toward its release by converging user and operational experiences into a highly efficient specification."
      },
      // {
      //   ja: "コンテンツ量の変動に耐えられるモジュール型レイアウトを提案し、運用チームが更新しやすいガイドラインを簡易版でまとめました。（仮）",
      //   en: "Placeholder: modular layout and lightweight guidelines for editors. Edit in data file when content is ready.",
      // },
    ],
  },

  campai: {
    title: "Internal Event Management App",
    titleJa: "社内イベント管理アプリ campai の企画・個人開発",
    roles: ["Planning", "UI Design", "UX Design", "Full-stack Dev(Claude Code)"],
    yearDuration: "2026/04 - 2026/05",
    tools: ["Next.js", "Prisma", "SQLite", "Slack Webhook", "Claude Code"],
    galleryImages: [campaiGallery1, campaiGallery2, campaiGallery3, campaiGallery4],
    sections: [
      {
        ja: "社内の飲み会・歓送迎会の出欠管理を Slack のやりとりから置き換える社内向け Web アプリを、企画から実装まで個人で制作しました。きっかけは幹事業務の属人化です。締切前の未回答者への声かけ、食の制限の個別確認、当日の人数把握といった細かな調整がすべて幹事に集中し、本来注力すべき企画や場選びに時間を割けない状態が続いていました。\n\nリマインドの自動化と参加者情報の一元管理によって、幹事が「調整」ではなく「企画」に集中できる状態をつくることを出発点に設計しています。",
        en: "I planned and built this internal web app on my own, end to end, to replace the Slack-based workflow for managing attendance at company parties and welcome/farewell gatherings. The trigger was how much of the work fell on a single organizer: chasing unanswered RSVPs before the deadline, confirming dietary restrictions one person at a time, and tracking head counts on the day. This coordination overhead consistently crowded out the work that actually matters—planning the event and choosing the venue.\n\nI designed the product around one goal: automate the reminders and centralize participant information so that the organizer can spend their time planning rather than chasing logistics.",
      },
      {
        ja: "設計上もっとも重視したのは、外国籍社員の増加にともなって多様化した食の制限への対応です。ハラール・ビーガン・アレルギーなどを社員ごとのプロフィールとして登録し、幹事が一覧で把握できるようにしました。情報が共有されないまま会場やコースが決まると、参加しづらさを感じる社員が生まれてしまう。これを運用ではなく仕組みで防ぐことを狙っています。あわせて食の好き嫌いやアルコール耐性、店の雰囲気の好みも登録できるようにし、イベント作成画面で統計として表示することで、店選びの判断材料が自然と手元に揃う構成にしました。\n\n出欠回答には締切カウントダウンと自動リマインドを、終了後には5段階評価と自由コメントによるフィードバック収集を実装。アンケートは複数設問と匿名モードに対応させています。「お酒が飲めないけれど言いづらい」「正直あの店は苦手だった」といった声が埋もれるとイベントは形骸化していくため、匿名で本音を出せる経路を意図的に用意しました。通知は Slack Webhook 連携、カレンダー登録は ICS ダウンロード、移動中の確認を見込んで PWA 対応も入れています。",
        en: "The design priority was handling the dietary needs that had grown far more varied as the number of non-Japanese employees increased. Halal, vegan, and allergy information is registered on each employee's profile and surfaced to the organizer as a single list. When a venue or course menu is decided without that information being shared, some employees simply end up feeling they cannot join—and I wanted the structure of the product, not individual diligence, to prevent that. Employees can also register food preferences, alcohol tolerance, and the kind of atmosphere they like, which the event-creation screen aggregates into statistics so the organizer has the basis for a venue decision already in hand.\n\nRSVPs come with a deadline countdown and automatic reminders, and each event closes with a five-point rating plus free-text feedback. Surveys support multiple questions and an anonymous mode. Comments like \"I don't drink but it's awkward to say so\" or \"honestly, that place wasn't for me\" tend to go unsaid, and once they do the event loses its point—so I deliberately built a route for people to be candid without attribution. Notifications go through a Slack webhook, calendar entries are offered as ICS downloads, and the app is PWA-enabled for checking on the move.",
      },
      {
        ja: "管理ダッシュボードには参加率の可視化と満足度推移を実装し、あわせて AI 分析インサイトの領域と、イベント作成画面にメンバーの食の趣向統計をもとにした店選び提案の UI を組み込んでいます。実際の AI 連携はコストの都合で見送りましたが、レイアウトと UX は実運用を前提に検討したうえで静的に実装済みです。\n\nメンバーの詳細なプロフィールと AI を掛け合わせられれば、店の選定やイベントの方向性の検討そのものを効率化でき、幹事の負担とストレスはさらに軽くできると考えています。全員が参加しやすく意見を言いやすい運営を続けられることが、結果としてチームの心理的安全性と、イベントの満足度・参加率の向上につながる。そこまでを見据えた設計にしました。",
        en: "The admin dashboard visualizes participation rates and satisfaction trends, and includes a space for AI-driven insights alongside a venue-suggestion UI on the event-creation screen that draws on the aggregated taste profiles of the members. The actual AI integration was left out for cost reasons; the layouts and interactions are implemented statically, but they were designed against a real operational scenario rather than as decoration.\n\nCombining detailed member profiles with AI would streamline venue selection and the shaping of an event itself, cutting the organizer's workload and stress further still. Sustaining an operation where everyone can take part easily and speak up honestly is, in the end, what builds psychological safety on a team and lifts both satisfaction and turnout—and that is the outcome I designed toward.",
      },
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
