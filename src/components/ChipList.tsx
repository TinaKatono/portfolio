/**
 * 語ごとに白地を敷いて「/」で区切る並び。
 * ABOUT のスキル・興味と、案件詳細の担当で使う。
 *
 * **白地は語ごとに敷くこと。** 区切りまで白くすると 1 本の帯になって、
 * いくつ挙げているのかが読み取れなくなる。値が 1 つだけの欄
 * （プロフィールの名前・生年月日など）は、この並びではなく全体に敷いてよい。
 */
export function ChipList({
  items,
  className = "",
}: {
  items: readonly string[];
  className?: string;
}) {
  return (
    /*
      overflow-wrap:anywhere を親に置くのが要点。break-keep だけだと、幅が
      足りないときに長い語が 1 語のまま横にはみ出す（案件詳細のサイドバーは
      768px で最も狭くなり、そこで実際にはみ出していた）。
    */
    <span className={`[overflow-wrap:anywhere] ${className}`}>
      {items.map((item, i) => (
        <span key={item}>
          {/*
            語の内側では折らない。素の 1 文字列にすると和文はどこでも改行でき、
            「ライティング」が「ライティン／グ」のように 1 文字だけ次行に落ちる。
            白地は box-decoration-clone で行ごとに切る（既定だと 1 枚の面になる）。
          */}
          <span className="box-decoration-clone break-keep bg-white">{item}</span>
          {i < items.length - 1 ? " / " : null}
        </span>
      ))}
    </span>
  );
}
