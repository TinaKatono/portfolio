import work3Gallery1 from "../assets/works/work_3/work_3_1.webp";


import work4Gallery1 from "../assets/works/work_4/work_4_1.webp";

import work2Gallery5 from "../assets/works/work_2/work_2_5.webp";
import work2Gallery1 from "../assets/works/work_2/work_2_1.webp";
import work2Gallery2 from "../assets/works/work_2/work_2_2.webp";
import work2Gallery7 from "../assets/works/work_2/work_2_7.webp";
import work2Gallery8 from "../assets/works/work_2/work_2_8.webp";
import work4Gallery2 from "../assets/works/work_4/work_4_2.webp";
import work4Gallery3 from "../assets/works/work_4/work_4_3.webp";

import work5Gallery2 from "../assets/works/work_5/work_5_2.webp";

import work1Gallery1 from "../assets/works/work_1/work_1_1.webp";
import work1Gallery2 from "../assets/works/work_1/work_1_2.webp";
import work1Gallery3 from "../assets/works/work_1/work_1_3.webp";

export type WorkDetailSection = {
  ja: string;
  en: string;
};

/**
 * 体制図の 1 人分。`label` は個人名ではなく役割（リーダー・ライターなど）。
 * `self` を付けた 1 人だけ青い印になるので、**各案件でちょうど 1 つだけ付ける。**
 */
export type WorkMember = {
  label: string;
  /**
   * 同じ役割の人数。2 以上のときだけ「× 3」が付く。
   * 1 人 1 行にすると大きなチームで欄が縦に伸びすぎるため、役割でまとめる。
   */
  count?: number;
  self?: boolean;
};

export type WorkDetail = {
  title: string;
  titleJa: string;
  roles: string[];
  /**
   * 案件の体制（詳細ページの TEAM）。**自分を最後に置く。**
   *
   * 未指定なら TEAM の枠ごと出ない。分かる案件にだけ書くこと
   * （曖昧なまま埋めると、面接で人数や分担を聞かれたときに答えられなくなる）。
   */
  members?: WorkMember[];
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
  /**
   * 第三者による紹介記事へのリンク（詳細ページに READ INTERVIEW ボタンが出る）。
   *
   * 制作実績インタビューなど、**クライアントや所属先が公開している記事**を想定。
   * 自己申告より強い裏づけになる一方、リンク先で公開されている範囲を超える情報を
   * 本文に書かないこと（記事側が公開実績の境界になる）。
   */
  articleUrl?: string;
};

/**
 * 各案件の詳細。文言・期間・ツールは後から差し替え前提のプレースホルダを含みます。
 */
export const workDetails: Record<string, WorkDetail> = {
  work_1: {
    title: "Brand Website for a Creative Atelier",
    titleJa: "ファッションアトリエのブランドサイト制作",
    roles: ["UIデザイン", "UXデザイン", "ライティング", "フロントエンド実装（Cursor）"],
    // 仲介会社経由の受注だが、制作は最初から最後まで自分ひとり
    members: [{ label: "(私)", self: true }],
    // ヒアリング開始から納品まで約 2 週間で、5 月中に完結した案件。
    // 他案件は範囲表記だが、ここは単月にしておく方が短納期であることが伝わる。
    yearDuration: "2026/05",
    // 技術構成（Next.js など）は本文で触れる。ここに並べると「その言語を書ける」と
    // 読まれるため、Tools には自分が操作した道具だけを載せる。
    tools: ["Figma", "Photoshop", "Cursor"],
    galleryImages: [work1Gallery1, work1Gallery2, work1Gallery3],
    siteUrl: "https://www.sachiaw.com/",
    sections: [
      {
        ja: "ファッションアトリエのブランドサイト新規制作案件において、ヒアリングからデザイン、コピーライティング、実装、素材選定、公開作業までを一人で担当しました。\n\nヒアリング開始から納品までおよそ2週間という短い期間だったため、Figmaではワイヤーフレームと簡易のデザインサンプルまでを固め、その段階で実装に着手。以降はデザインと実装を並行させ、静的なカンプではなく実画面でご確認いただく進め方に切り替えました。カンプの往復を減らし、実際の文字サイズや行間、スクロールしたときの見え方といった、静止画では判断できない部分の調整に時間を回すようにしました。",
        en: "On a new brand website for a fashion atelier, I owned the entire process on my own—from the initial hearing to design, copywriting, implementation, asset selection, and launch.\n\nWith roughly two weeks from the first hearing to delivery, I locked only the wireframes and light design samples in Figma before moving into implementation. From there I ran design and build in parallel, reviewing on live screens rather than static mockups. Cutting down the round trips on comps freed the limited time for what a static image cannot settle: type at its real size, line spacing, and how the whole thing reads while scrolling.",
      },
      {
        ja: "サービスのターゲット層は、50代以上の女性です。時間と経済的な余裕のある主婦層や富裕層が中心で、ファッションを長く趣味としてきた方から、自身の表現やブランドづくりに踏み出そうとする方までを想定しています。いずれも上質なものを見慣れていて目が厳しい層だと捉え、ラグジュアリーでありながら気負わせない、アトリエの空気感を軸にトーンを設計しました。\n\n書体は、欧文の見出しに Antic Didone、和文に Zen Old Mincho を選定しています。Antic Didone は縦画と横画の太さの差が大きいセリフ体で、ファッション誌のロゴに多いディドネ様式に属します。「Beyond the Surface.」のように語数の少ない見出しは、書体そのものの線の強弱で成立させる必要があると考えて選びました。和文の Zen Old Mincho は、古い活字に近い骨格を残したオールド明朝です。ゴシック体では砕けた印象になり、線の均一なモダン明朝では硬く見えるため、その中間を取っています。字間と行間はどちらも標準より広く取り、文章量のあるページでも窮屈に見えないようにしました。",
        en: "The service targets women aged fifty and above—largely homemakers and affluent households with both time and means—ranging from those who have followed fashion for decades to those stepping into building an expression or a brand of their own. Assuming an audience long accustomed to quality, and exacting about it, I built the tone around the atmosphere of an atelier: luxurious, yet never intimidating.\n\nFor type, I chose Antic Didone for the Latin headings and Zen Old Mincho for the Japanese. Antic Didone is a serif with a wide contrast between thick and thin strokes, in the Didone style common to fashion magazine mastheads. A heading as short as \"Beyond the Surface.\" has to be carried by the typeface itself, which is why I chose it. Zen Old Mincho keeps the skeleton of older metal type: a Gothic would have read too casual, a modern Mincho with even strokes too rigid, so this sits between the two. Letter- and line-spacing are both set wider than the defaults, so that longer passages never feel cramped.",
      },
      {
        ja: "「Beyond the Surface.（表層を超えて）」をはじめとするコピーは、ブランドの思想である「構造から、思想から、すべてをデザインする」という考え方を一語で受け止められる言葉を探すところから設計しました。候補を数多く並べたうえでブランドの温度に合うものを選び、語感と字数を整えています。クライアント提供の写真以外のビジュアルもこちらで選定し、素材・光・余白のトーンをサイト全体で揃えました。\n\n構成にはNext.jsを採用し、実装はCursorを中心に進めました。タイポグラフィの詰めや余白の微調整といった精度が要る部分は手作業でコーディングしています。2週間という限られた期間での納品でしたが、クライアントからは「想像していたよりかなりクオリティが高い」と、期待を上回る評価をいただきました。",
        en: "The copy, including \"Beyond the Surface.\", started from the search for words that could hold the brand's own philosophy—designing everything from structure and from thought—in a single line. I lined up a wide pool of candidates, then selected what matched the brand's temperature and tuned the wording and length. Every visual beyond the client-supplied photography was also sourced on my side, aligning material, light, and negative space across the whole site.\n\nThe site is built on Next.js, with implementation running primarily in Cursor and the parts that demand precision—typographic tightening, fine adjustments to spacing—hand-coded. Delivered inside a two-week window, the work drew a closing verdict from the client that the quality was \"far higher than they had imagined\"—ahead of what they had expected going in.",
      },
    ],
  },

  work_6: {
    title: "Frontend Implementation for Apparel E-Commerce",
    titleJa: "アパレルECサイトのフロントエンド実装",
    roles: ["UI実装", "インタラクション実装"],
    /*
      複数のブランドを 13 か月かけて順に担当した案件なので、体制はブランドごとに
      入れ替わっている。ここに書いたのは毎回おおよそこうだった、という標準的な座組み。

      **人数は記憶ベース。** ディレクターは 2〜3 名で振れがあり、多い方を採ってある。
      面接で詰められたら「だいたいこの規模」と答えられる粒度に留めること。

      デザイナーはブランド側が指定した他社のデザイナー。その経緯は本文に書いてあるので、
      ここでは役割だけを置いて人数には触れない。
    */
    members: [
      { label: "PM" },
      { label: "ディレクター", count: 3 },
      { label: "デザイナー" },
      { label: "サーバーサイド", count: 3 },
      { label: "(私)", self: true },
    ],
    yearDuration: "2023/04 - 2024/05",
    tools: ["Adobe XD", "Figma", "HTML", "CSS", "JavaScript", "jQuery"],
    sections: [
      {
        ja: "アパレルECの開発・運営を手がける企業との協業案件として、アパレルブランドのECサイトのフロントエンド実装を担当しました。この期間に複数のブランドを順に担当しており、国内の有名アパレルブランドを中心に、海外ブランドのサイトも手がけています。\n\nデザインはブランド側が抱えるデザイン会社が制作したもので、XDやFigmaで渡されたカンプを忠実に実装するのが私の役割でした。フロント部分はほぼ一人で組み上げ、そこから先の自社CMSへの実装はエンジニアが引き継ぐ分業です。",
        en: "As a collaborative engagement with a firm specializing in the development and operation of apparel e-commerce, I handled frontend implementation for apparel brand online stores. Over this period I took on several brands in sequence—primarily well-known domestic apparel labels, along with a site for an overseas brand.\n\nThe designs themselves came from agencies retained by each brand, handed over as comps in XD or Figma; my role was to reproduce them faithfully in the browser. The frontend was almost entirely mine to assemble, with engineers taking over from there to implement it into the in-house CMS.",
      },
      {
        ja: "AIによるコーディング支援がまだ実務に入っていなかった時期で、HTML・CSS・JavaScript（jQuery）を手で書いて組み上げていました。ブランドごとにデザインの個性が大きく異なるため、メイソンリーレイアウトやパララックス、スクロールに連動した演出など、求められる表現に応じてライブラリを使い分けています。\n\nこの案件で最も鍛えられたのは、実装精度に対する基準です。デザインとの1pxのズレも指摘される環境で、「だいたい合っている」を許さない目線を身につけました。ブランドサイトでは余白やタイポグラフィのわずかな差がそのまま世界観の毀損につながるため、この時期に叩き込まれた精度への感覚は、デザインと実装の両方を担当するようになった現在の仕事の土台になっています。",
        en: "This predates AI-assisted coding entering practical workflows, so everything was hand-written in HTML, CSS, and JavaScript (jQuery). Each brand carried a distinctly different design character, so I drew on different libraries depending on what a given expression demanded—masonry layouts, parallax, scroll-linked motion, and the like.\n\nWhat this work sharpened most was my standard for implementation accuracy. In an environment where even a single pixel of deviation from the design would be flagged, I acquired an eye that refuses to settle for \"close enough.\" On brand sites, slight differences in spacing or typography degrade the intended world directly—so the sense of precision drilled into me during this period has become the foundation of how I work now that I handle both design and implementation.",
      },
    ],
  },

  work_3: {
    title: "Integrated Medical Supply Chain UX",
    titleJa: "医療サプライチェーンのUX・情報設計",
    roles: [
      "UIデザイン",
      "UXデザイン",
      "情報設計",
      "要件定義",
    ],
    // エンジニアはサーバーサイド・フロントエンドとも途中で 1 名ずつ抜けているが、
    // 体制図は最大時の人数で書いている。デザイナーは自分ひとり。
    members: [
      { label: "PM" },
      { label: "サーバーサイド", count: 3 },
      { label: "フロントエンド", count: 3 },
      { label: "(私)", self: true },
    ],
    yearDuration: "2025/07 - 2025/10",
    tools: ["Figma"],
    galleryImages: [work3Gallery1,],
    sections: [
      {
        ja: "株式会社Kiviaq の薬局DXサービス「キビヤックファーマシー」の新規立ち上げに、UI/UXデザイナーとして参画しました。患者向けLINEミニアプリ・薬局スタッフ向け管理画面・配送業者向けモバイルアプリの3システムにまたがる複雑な業務フローを対象に、要件定義から画面設計までをリードし、プロジェクトが動き出してからは仕様調整や関係者間の合意形成といった進行実務も担っています。特に薬機法等の法的観点や現場運用の制約を深く読み解き、初期の要望を単に形にするだけでなく、データの流動性や例外分岐、そして現場で実際に機能する運用までを見据えたUX設計を徹底しました。",
        en: "I joined Kiviaq as a UI/UX designer for the launch of their new pharmacy DX service, leading the process from requirements definition through screen design for a complex ecosystem spanning three interconnected platforms: a patient-facing LINE Mini-app, a pharmacy administration dashboard, and a courier mobile app. Once the project was underway, I also took on the day-to-day work of driving it forward—resolving specifications and building consensus among stakeholders. Navigating the stringent requirements of pharmaceutical regulations and real-world operational constraints, I focused on creating a UX that transcends mere visual representation—meticulously addressing data flows, edge-case logic, and feasible on-site workflows.",
      },
      {
        ja: "3つのシステムが相互に依存する構成のため、片方の仕様変更がもう片方の前提を崩す、ということが頻繁に起こりました。サーバーサイドはエンジニアが担当していましたが、業務フロー全体をもっとも把握しているのが自分だったため、「この要望は何を壊すのか」「技術的にどこまで可能か」をエンジニアと突き合わせながら、実現可否を一つずつ詰めていく役回りを担いました。技術的な判断はエンジニアの知見に依拠し、全体の整合性を保つ視点は自分が持ち続ける、という分担です。\n\nその過程で、システム間の矛盾を早期に検知するために全体の分岐を網羅するシーケンス図を作成し、職種をまたいだ共通言語として運用しました。仕様の議論が「言った言わない」ではなく、図の上のどの分岐の話かに落ちるため、認識のずれが起きた時点で気づける状態をつくれたことが、複雑さに耐えるうえで効いています。",
        en: "Because the three systems were mutually dependent, a change to one specification would routinely invalidate assumptions in another. A backend engineer owned the server side, but as the person with the fullest picture of the end-to-end operational flow, I took on the work of resolving feasibility item by item—checking with the engineer on what a given request would break and how far it was technically viable. Technical judgment rested on their expertise; holding the consistency of the whole was mine.\n\nOut of that process, I built sequence diagrams covering every branch of the flow to surface contradictions between systems early, and ran them as a shared language across disciplines. Specification discussions could then resolve to \"which branch on the diagram\" rather than competing recollections, which meant misalignments became visible the moment they appeared—the thing that made the complexity manageable.",
      },
      {
        ja: "制約が多い中でもUIとして破綻しない構造を追求し、特に管理画面領域では、運用者の判断を妨げない情報設計に注力しました。タイトなスケジュールの中、業界知識を短期で吸収しながら要件精査とプロトタイプ作成を行い、無事納期内リリースを実現できました。",
        en: "Throughout, I pursued a structure that would not collapse as an interface despite the density of constraints—particularly in the administrative dashboard, where I focused on an information architecture that stays out of the operator's way at the moment of judgment. Within a high-pressure timeline, I rapidly absorbed domain-specific knowledge while refining requirements and building prototypes, ultimately securing an on-time launch.",
      },
    ],
  },

  work_4: {
    title: "Corporate Website for a Construction Company",
    titleJa: "建設会社のコーポレートサイト作成",
    roles: ["UIデザイン", "ライティング", "フロントエンド実装（Cursor）"],
    members: [{ label: "(私)", self: true }],
    // 実作業は約 2 週間。Sachi と同じく、短納期であることが伝わるよう単月表記にしている。
    yearDuration: "2026/04",
    tools: ["Figma", "Photoshop", "Cursor"],
    galleryImages: [work4Gallery1, work4Gallery2, work4Gallery3],
    siteUrl: "https://www.saikaimatsunaga.com/",
    sections: [
      {
        ja: "長崎県西海市で砂防工事や道路舗装などの公共事業を担う建設会社様のコーポレートサイトリニューアル案件において、トーン＆マナーの整理から画面設計、ライティング、実装・公開までを一貫して担当しました。\n\n制作期間はおよそ2週間。加えて、参照できる既存の情報も、使用できる写真素材も限られた状態からのスタートでした。支給されていたのはロゴのみで、それ以外は自分で集めるかつくるかを、その都度判断していく必要がありました。",
        en: "On a corporate website renewal for a construction company in Saikai City, Nagasaki—handling public works such as erosion control and road paving—I was responsible for the entire process: defining the tone and manner, screen design, copywriting, implementation, and launch.\n\nThe build ran to roughly two weeks. On top of that, both the existing reference material and the usable photography were scarce. The logo was the only asset provided; everything else was a decision, case by case, about whether to source it or make it.",
      },
      {
        ja: "最大の課題は、「西海市に根ざした企業である」というサイトの中心テーマを、素材がほとんどない状態でどう成立させるかでした。地域性は言葉で主張するより、画面に流れる風景や光の質で伝わる方が強く残ります。しかし西海市の写真素材は流通量そのものが少なく、そのまま使えるものはごくわずかでした。\n\n使用可能な素材を探し集めたうえで、一枚ずつ色味を調整し、サイト全体を通して同じ空気に見えるところまで揃えています。撮り下ろしができない条件下では、写真そのものより「素材同士の統一感」が地域性を支えると考え、そこを設計対象として扱いました。",
        en: "The central challenge was making the site's core theme—a company rooted in Saikai City—hold up with almost no material to build it from. A sense of place lands more durably through the landscape and quality of light running across the screen than through words claiming it. Yet photography of Saikai City barely circulates, and very little of it was usable as-is.\n\nAfter gathering what could be used, I graded each image individually until the whole site read as a single atmosphere. Where an original shoot isn't possible, what carries a sense of place is less the photography itself than the coherence between images—so I treated that coherence as the thing to design.",
      },
      {
        ja: "配色は、唯一支給されていたロゴのブルーとグリーンを起点にしました。「採用面を踏まえ、やさしく明るく、親しみの持てる雰囲気に」というご要望に対し、企業カラーの彩度と明度を落として自然に近い色域へ寄せ、西海市の環境と地続きに見えるトーンを提案しています。建設業としての実直さは残しつつ、応募者が身構えない温度に収めることを狙いました。\n\n実装はコンポーネント単位で再利用しやすい構造とし、更新時に崩れにくい形にしています。画面デザインについては、クライアント様から高いご評価をいただきました。",
        en: "The palette started from the blue and green of the logo—the one asset I was given. Against the client's request for something gentle, bright, and approachable in service of recruitment, I lowered the saturation and brightness of the corporate colors toward a more natural range, proposing a tone that reads as continuous with the environment of Saikai City. The aim was to keep the straightforwardness proper to construction work while landing on a warmth that doesn't put applicants on guard.\n\nImplementation used a component-based structure, reusable and resistant to breaking when content is updated. The client's response to the screen design was highly positive.",
      },
    ],
  },

  // "fadila-oil": {
  //   title: "FADILA OIL",
  //   titleJa: "ファディラ オイル（仮）",
  //   roles: ["UIデザイン", "UXデザイン", "フロントエンド実装（Cursor）"],
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

  work_5: {
    title: "Recruitment Media & Management System",
    titleJa: "採用メディアと管理システムの開発設計",
    roles: ["UIデザイン", "UXデザイン", "情報設計"],
    // サーバーサイドの人数は記憶ベース。増減が分かったら直す。
    members: [
      { label: "PM" },
      { label: "サーバーサイド", count: 2 },
      { label: "フロントエンド" },
      { label: "(私)", self: true },
    ],
    yearDuration: "2024/06 - 2025/01",
    tools: ["Figma", "FigJam"],
    // 当初のメインビジュアルは掲載を取り下げ済み（現行サイトから撤去されており、
    // クライアント要望で当初案から変わった経緯があるため実績として示さない）。
    // 代わりに公開中のトップ画面をモックに載せた 1 枚を使う。
    galleryImages: [work5Gallery2],
    siteUrl: "https://recpr.jp/jobOpenings",
    sections: [
      {
        ja: "採用領域のメディアプロダクト（ユーザー向けサイト＋企業向け管理画面）の新規開発に、UI/UXデザイナーとして参画しました。求人・企業・記事など複数のコンテンツを扱う構造のため、単発の画面作成ではなく、検索/絞り込み・回遊・編集運用まで含めた体験設計と、段階的な拡張を前提にした情報設計が求められるプロジェクトでした。\n\n開発中は、クライアント検収で出たフィードバックを起点に、要望をそのまま反映するのではなく、「今のフェーズでの最適解」と「後続フェーズで条件が増えたときに破綻しない構造」の両立を重視。たとえば絞り込みUIでは、将来的に条件が増える前提で煩雑化を避けるUIを提案し、PC/スマホそれぞれの見え方や運用上の懸念も踏まえて意思決定まで落とし込みました。\n\nまた、管理画面と運用時に発生する運用ストレス（プレビュー確認のために行き来が必要になる等）に対して、表示ルールや画像の扱いを整理し、運用者が迷わない仕様に調整。またビジュアルデザイン面では、要望が細部まで具体的で意思決定が揺れやすい状況だったため、案の比較軸（ユーザー影響・運用・拡張性・実装負荷）を揃えて合意形成を進め、手戻りしにくい進め方を整えました。\n\n結果として、検収で挙がった要望を吸収しながら、ユーザー体験と運用体験の両面で無理のない仕様に収束させることができました。予定どおりの納期でリリースまで完了し、クライアントにもご満足いただいています。",
        en:"I joined the development of a new recruitment media platform—encompassing both the user-facing site and the corporate administration dashboard—as a UI/UX designer. The project involved a complex structure handling various content types, including job listings, company profiles, and articles, requiring an information architecture designed for seamless navigation, advanced filtering, and long-term scalability.\n\nThroughout the development phase, I prioritized balancing immediate solutions with future-proof structures. For example, when designing the filtering UI, I proposed a system that remains intuitive even as additional parameters are added in subsequent phases, carefully aligning the cross-device experience with operational feasibility.\n\nFurthermore, I focused on optimizing the administrative experience by streamlining complex rules for content management and preview workflows to eliminate operational friction. To navigate high-fidelity feedback and evolving requirements from the client, I established a clear evaluation framework based on user impact, scalability, and implementation cost. This structured approach facilitated decisive consensus-building and minimized rework, converging the user and operational experiences into a specification that held up on both sides. The product shipped within the planned schedule, and the client was satisfied with the result."
      },
      // {
      //   ja: "コンテンツ量の変動に耐えられるモジュール型レイアウトを提案し、運用チームが更新しやすいガイドラインを簡易版でまとめました。（仮）",
      //   en: "Placeholder: modular layout and lightweight guidelines for editors. Edit in data file when content is ready.",
      // },
    ],
  },

  work_2: {
    title: "Internal Event Management App",
    // 「Claude\u00A0Code」の空白は改行しないスペース（U+00A0）。通常の空白だと
    // サイドバーの幅で「Claude / Code」と行またぎで割れる。
    titleJa: "社内イベント管理アプリ campai の企画・Claude\u00A0Code での個人開発",
    roles: ["企画", "UIデザイン", "UXデザイン", "フルスタック開発（Claude Code）"],
    members: [{ label: "(私)", self: true }],
    yearDuration: "2026/04 - 2026/05",
    // 構成（Next.js / Prisma / SQLite）は本文に記載。Tools は操作した道具のみ。
    tools: ["Figma", "Claude Code"],
    /*
      並び順は本文と対応させている。
      1 枚目 = ロゴのキーカード（一覧のサムネイルと同じ絵）→ 導入のセクション、
      2〜3 枚目 = 参加者側のスマホ画面（出欠回答・カレンダー・アンケート・
      プロフィール設定）→ 食の制限や出欠回答を扱うセクション、
      4 枚目以降 = 管理ダッシュボードなどの管理側。
      本文の下にも続く。
      イベント作成画面（work_2_3.webp）は絵として弱いため外している。ファイル自体は
      assets に残してあるので、必要になれば import を戻すだけでよい。

      参加者側の画面を先に置くのは、絵として強く、製品の性格が一目で伝わるため。
      スマホ画面は横並びに合成してある。単体の縦長スクショだとカラム幅いっぱいに
      引き伸ばされ、UI が不自然に大きく見えてしまうため。
    */
    galleryImages: [
      work2Gallery5,
      work2Gallery7,
      work2Gallery8,
      work2Gallery1,
      work2Gallery2,
    ],
    sections: [
      {
        ja: "社内の飲み会・歓送迎会の出欠管理を Slack のやりとりから置き換える社内向け Web アプリを、自主制作として企画から実装まで一人でつくりました。きっかけは、社内に外国籍の社員が増えたことです。宗教や文化的な背景から食事に制限のある同僚が増え、会場やコースが決まってから一人ずつ確認して回る進め方では追いつかなくなっていました。その確認も含め、細かな調整はすべて幹事に集中していました。締切前の未回答者への声かけ、食の制限の個別確認、当日の人数把握に追われ、本来注力すべき企画や場選びに時間を割けない状態が続いていました。\n\n参加者情報を一元管理して食の制限が最初から共有された状態をつくること、リマインドを自動化して幹事が「調整」ではなく「企画」に集中できるようにすること。この 2 つを設計の軸にしました。構成は Next.js と Prisma、データベースは SQLite。実装は Claude Code を用いて進めました。\n\nテーマカラーは、飲み会の定番であるビールの黄金色から連想したイエロー。業務ツールらしい硬さを避け、開いた瞬間に集まりのわくわくを感じてもらう意図があります。お酒が得意でない人も、こういう場が少し苦手な人も、みんなでゆるっと乾杯を楽しめますように、という思いをこの色にのせています。",
        en: "As a self-initiated project, I planned and built this internal web app on my own, end to end, to replace the Slack-based workflow for managing attendance at company parties and welcome/farewell gatherings. What set it off was the growing number of non-Japanese employees: with more colleagues on restricted diets for religious or cultural reasons, checking with each person after the venue and course had already been chosen no longer held up. That checking, along with every other small piece of coordination, fell on a single organizer—chasing unanswered RSVPs before the deadline, confirming dietary restrictions one person at a time, tracking head counts on the day—and it consistently crowded out the work that actually matters: planning the event and choosing the venue.\n\nTwo things shaped the design: centralizing participant information so that dietary restrictions are shared from the outset, and automating reminders so that the organizer can spend their time planning rather than chasing logistics. It runs on Next.js with Prisma and SQLite, built using Claude Code.\n\nThe theme color is a yellow that grew out of the golden hue of beer—the drink that comes to mind first at any gathering. Over the stiffness of a typical business tool, I wanted the fun of getting together to come through the moment the app opens. And a quiet wish rides along in that color, too: that everyone—those who don't really drink, or find these occasions a little much—can just kick back and enjoy the same table.",
      },
      {
        ja: "食の制限への対応が、この企画の出発点です。ハラール・ビーガン・アレルギーなどを社員ごとのプロフィールとして登録し、幹事が一覧で把握できるようにしました。情報が共有されないまま会場やコースが決まると、参加しづらさを感じる社員が生まれてしまう。これを運用ではなく仕組みで防ぐことを狙っています。あわせて食の好き嫌いやアルコール耐性、店の雰囲気の好みも登録できるようにし、イベント作成画面で統計として表示することで、店選びの判断材料が自然と手元に揃う構成にしました。\n\n出欠回答には締切カウントダウンと自動リマインドを、終了後には5段階評価と自由コメントによるフィードバック収集を実装。アンケートは複数設問と匿名モードに対応させています。「お酒が飲めないけれど言いづらい」「正直あの店は苦手だった」といった声が埋もれるとイベントは形骸化していくため、匿名で本音を出せる経路を意図的に用意しました。通知は Slack Webhook 連携、カレンダー登録は ICS ダウンロード、移動中の確認を見込んで PWA 対応も入れています。",
        en: "Handling those dietary needs was the starting point for the whole project. Halal, vegan, and allergy information is registered on each employee's profile and surfaced to the organizer as a single list. When a venue or course menu is decided without that information being shared, some employees simply end up feeling they cannot join—and I wanted the structure of the product, not individual diligence, to prevent that. Employees can also register food preferences, alcohol tolerance, and the kind of atmosphere they like, which the event-creation screen aggregates into statistics so the organizer has the basis for a venue decision already in hand.\n\nRSVPs come with a deadline countdown and automatic reminders, and each event closes with a five-point rating plus free-text feedback. Surveys support multiple questions and an anonymous mode. Comments like \"I don't drink but it's awkward to say so\" or \"honestly, that place wasn't for me\" tend to go unsaid, and once they do the event loses its point—so I deliberately built a route for people to be candid without attribution. Notifications go through a Slack webhook, calendar entries are offered as ICS downloads, and the app is PWA-enabled for checking on the move.",
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
  //   roles: ["UXデザイン", "ノーコード実装（Studio）"],
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
