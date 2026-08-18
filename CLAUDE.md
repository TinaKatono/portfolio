# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概要

Tina Katono の個人ポートフォリオサイト。Vite + React 18 + TypeScript + Tailwind の SPA。

- 本番: https://tinakatono.com （Vercel / GitHub 連携で `main` push 時に自動デプロイ）
- リポジトリのルートはこの `dev/` ディレクトリ。親の `portfolio_202604/` は git 管理外。

## コマンド

```bash
npm run dev      # Vite 開発サーバー（http://localhost:5173）
npm run build    # tsc で型チェック → vite build
npm run preview  # dist/ をローカル配信
```

テストとリンタは未設定。`npm run build` の `tsc` が唯一の自動チェックなので、変更後はこれを通すこと。型エラーはビルドを止める（過去に未使用 import の TS6133 でデプロイが落ちている）。

## コンテンツはデータ駆動

WORK の追加・編集でコンポーネントを触る必要はない。触るのは 2 ファイル。

**`src/data/workDetails.ts`** — 案件情報の単一の正。`Record<id, WorkDetail>`。詳細ページ `/works/:id` はここだけを見て描画するので、**一覧に出す前でも `/works/<id>` で表示確認できる**。

**`src/data/workItems.ts`** — 一覧の並び順とサムネイルのみを持つ。`title` と `roles` は `workDetails` から自動同期される（`workDetails` に id が無ければ throw して気付けるようにしてある）。掲載を止めたい案件は配列の行をコメントアウトする運用。

案件を 1 件追加する手順:

1. `workDetails.ts` に id をキーとしてエントリを追加
2. `workItems.ts` の配列に `{ id, thumbSrc }` を追加（配列の順序 = 一覧の表示順）

### WorkDetail の決まり

- **`sections[]` は `ja` と `en` の両方が必須。** 既存案件すべてが日英併記で、片方だけだと表示が崩れる。段落は `\n\n` で区切る（`whitespace-pre-line` で描画）。
- **`galleryImages` は位置対応。** `galleryImages[i]` が `sections[i]` の**上**に入り、セクション数を超えた分は本文の下にまとめて続く。画像が 1 枚のときだけプレースホルダー枠を出さない分岐がある（`WorkDetail.tsx`）。
- `thumbSrc` は任意。未指定なら一覧でグレーのプレースホルダー枠になる。
- `title` は製品名ではなく内容を表す英語（例 `Recruitment Media & Management System`）、`titleJa` が日本語タイトル。

### 画像

`src/assets/works/<案件id>/` に webp で置き、data ファイルから import する（Vite がハッシュ付きで bundle する）。

- **縦横比は 16:9 に揃える。** 一覧のサムネイル枠も詳細ページの画像欠けプレースホルダ枠も `aspect-video` なので、ここを外すと実画像だけが浮く。書き出しは 1200×675 か 1600×900。
- **幅は 1600px まで。** 本文カラムは PC で 660px なので 1600px で 2.4 倍あり、それ以上はファイルサイズだけが増える（3200px で書き出した work_4 は 3 枚 550KB あり、1600px に落として 229KB になった）。
- **切り抜きで比を合わせないこと。** サイトのキャプチャなので上下が欠ける。ビューポートの幅を広げて撮り直す。
- ファイル名は `work_<案件番号>_<連番>.webp` で、連番は 1 から詰めて振る。png などの元データは置かない（webp だけを bundle しているので容量だけ食う）。

## ルーティング

`src/App.tsx` の `BrowserRouter` の `basename` は Vite の `import.meta.env.BASE_URL` から導出される。`vite.config.ts` の `base` を変えると router 側も自動で追従するので、**両方を手で合わせようとしないこと**。現在は `"/"`（ルート配信）。

`RouteScrollEffects` が 2 つの責務を持つ: pathname 変化で先頭へスクロール、hash 付き遷移（`/#about` `/#work`）で該当セクションへスクロール。同一ページ内で hash だけ変わったときは先頭に戻さない。

未知のパスは `/` へ redirect するため、存在しない `/works/xxx` は 404 ではなくトップに飛ぶ。

## Top.tsx について

`src/Top.tsx` は約 1100 行の 1 ファイルで、スクロール量に連動した演出（ヒーロー見出しの縮小・セクションの重なり・マルキー）をまとめて持っている。**演出の調整はほぼ定数の書き換えで済む**ので、まず該当の定数を探す:

- `P_TRIO_DONE` / `P_TITLE_SHRINK_END`（L69-71）— ヒーロー→ABOUT のスクロール進捗の区切り
- `overlapStyle` の `--section-overlap`（L64）— セクション間の重なり量。ヒーロー←ABOUT と ABOUT←WORK で共通
- `HERO_INTRO_CHAR_STAGGER_MS` / `HERO_INTRO_WORD_GAP_MS`（L74-75）— 名前の 1 文字ずつ出現の間隔
- `HERO_SCROLL_HINT_MAX_OFFSET`（L77）— スクロール誘導矢印が消える距離
- `WORK_BELOW_STATEMENT_SCROLL_PX_PER_Y`（L477）— マルキーの横移動量
- `WORK_ROLE_CURSOR_OFFSET`（L23）— WORK 行ホバー時の roles ツールチップ位置

マルキーは 2 層（黒／白）を rAF で同一 transform に揃えている。`translateX(-50%)` と `100vw` の組み合わせでズレるため margin 方式にしてある（コード内コメント参照）。

## 共通コンポーネント

- `SiteHeader` — ナビのみ右寄せ。文字色は `mix-blend-mode: difference` で背景に応じて反転する。狭い画面はハンバーガー＋ドロワー（portal）。
- `SiteCenterBrand` — サブページ用の中央ブランド。**背景を持たない `fixed top-0 z-40`** なので、スクロールすると本文と視覚的に重なる。全案件ページ共通の既知の挙動。

### ロゴ・見出しの共通スタイル（`components/brand.tsx`）

ロゴ・見出し・キャッチはすべて同じ作りに揃えてある。新しい見出しを足すときもこれに倣う。

| export | 用途 |
| --- | --- |
| `BRAND_TEXT` | 太ゴシックの文字クラス。文字サイズだけ呼び出し側で指定する |
| `BRAND_GAP` | 単語と図形のあいだの余白（`0.1em`） |
| `InlineMark` | 単語間に挟むカラフルな図形。**サイズは `em` 指定**なので置いた場所の文字サイズに自動追従する |
| `MARK_IMAGES` | 図形 4 点（`src/assets/fv/fv_1〜4.svg`）。0=ピンク / 1=青 / 2=緑 / 3=黄 |
| `SCROLL_HINT_MARK` | FV のスクロール誘導の矢印（`fv_5.svg`）。単語間に挟む図形ではないので `MARK_IMAGES` には入れない |

**文字サイズは図形の親要素に置くこと。** `InlineMark` は `em` で自分の寸法を決めるため、子要素側に `text-[...]` を書くと図形の基準が body の 16px になって小さく出る。

**折り返す見出しでは、図形を後続の単語と同じ `inline-flex` の塊に入れる**（CTA の `GET IN TOUCH` がその例）。そうしないと改行時に図形だけが行末に取り残される。

ナビ（`SiteHeader`）は 16px と小さいため、書体だけ揃えて図形は入れていない。

## フォントとアニメーション

- **サイト全体を Zen Kaku Gothic New に統一している。** `font-sans` と `font-jp` がどちらも同じ書体で、`index.html` の Google Fonts で 400/500/700 を読み込んでいる。
- **本来の指定書体は「A P-OTF A1ゴシック StdN B」**（モリサワ）だが、商用書体で Web 配信に別途ライセンスが必要なため、骨格の近い無償書体 Zen Kaku Gothic New で代替している。Adobe Fonts 等のライセンスが用意できたら `tailwind.config.js` の `sans` / `jp` 配列の先頭に正式なファミリー名を足し、`index.html` の読み込みを差し替えるだけで切り替わる。
- `font-sans` と `font-jp` が同じ書体なので、**現状この 2 つを使い分ける意味はない**。将来欧文だけ別書体に戻す余地を残して分けたまま置いてある。
- **`font-serif`（Cardo）はどこからも使っていない。** 以前はブランドの「KATONO」などが Cardo の和欧混植だったが、太ゴシック統一に伴い廃止した。使うなら `index.html` に Cardo の読み込みを戻す必要がある（今は落としてある）。
- keyframes / animation はすべて `tailwind.config.js` に定義し、`animate-*` で当てる。`motion-reduce:` と `prefersReducedMotion()` で reduced-motion に配慮している箇所があるので、演出追加時は踏襲する。

## 検索避けは意図的

このサイトは**インデックスさせない前提**で、4 箇所に noindex が入っている。どれかを消すときは他も揃えること。

| 場所 | 内容 |
| --- | --- |
| `index.html` | `<meta name="robots" content="noindex, nofollow">` |
| `vercel.json` | 全パスに `X-Robots-Tag` ヘッダ |
| `vite.config.ts` | dev / preview サーバーにも同ヘッダ |
| `public/robots.txt` | `Disallow: /` |

`public/_headers` は Netlify 形式で、Vercel では読まれない（実効は `vercel.json` 側）。

## Vercel

`vercel.json` が SPA rewrite（全パス → `/index.html`）と `/assets/*` の長期キャッシュを定義している。**この rewrite が無いと直リンクの `/contact` や `/works/:id` が 404 になる。**

`dist/` は `.gitignore` 済みで、ビルドは Vercel 側で走る。

問い合わせの宛先は `src/data/contact.ts` の `CONTACT_EMAIL` 一箇所。Contact ページはこれを `mailto:` リンクに組み立てるだけで、フォーム送信のバックエンドは無い。
