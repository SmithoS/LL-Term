function getBDmsg() {
    const bd = {
        "B0803": "高坂穂乃果"
        , "B1021": "絢瀬絵里"
        , "B0912": "南ことり"
        , "B0315": "園田海未"
        , "B1101": "星空凛"
        , "B0419": "西木野真姫"
        , "B0609": "東條希"
        , "B0117": "小泉花陽"
        , "B0722": "矢澤にこ"
        , "B0801": "高海千歌"
        , "B0919": "桜内梨子"
        , "B0210": "松浦果南"
        , "B0101": "黒澤ダイヤ"
        , "B0417": "渡辺曜"
        , "B0713": "津島善子"
        , "B0304": "国木田花丸"
        , "B0613": "小原鞠莉"
        , "B0921": "黒澤ルビィ"
        , "B0504": "鹿角聖良"
        , "B1212": "鹿角理亞"
        , "B0301": "上原歩夢"
        , "B0123": "中須かすみ"
        , "B0403": "桜坂しずく"
        , "B0629": "朝香果林"
        , "B0530": "宮下愛"
        , "B1216": "近江彼方"
        , "B0808": "優木せつ菜"
        , "B0205": "エマ・ヴェルデ"
        , "B1113": "天王寺璃奈"
        , "B1005": "三船栞子"
        , "B1206": "ミア・テイラー"
        , "B0215": "ショウ・ランジュ"
        , "B0501": "澁谷かのん"
        , "B0717": "唐可可"
        , "B0225": "嵐千砂都"
        , "B0928": "平安名すみれ"
        , "B1124": "葉月恋"
    };
    const now = moment();
    const k = "B" + now.format("MMDD");
    const n = bd[k];
    let m = "";
    if (n) {
        m = `${n}ちゃん誕生日おめでとう！(${now.format("MM/DD")})`;
    }
    return m;
}
setTimeout(() => {
    console.log("　　　　　　 　　　　 /7/7　　　　　 　 　　 　 　　　 /7/7\n　 ∠ニニニﾆ7∠ニニニﾆ７ ∠ニニニﾆ7　　 _／ニ7∠ニニニﾆ７　/7\n　∠ニニニﾆ７　　　  // ∠ニニニﾆ７∠ニﾆ ／　　　　　 //　//\n　　∠ﾆﾆﾆ／ 　 　∠ﾆ／　 　∠ﾆﾆﾆ／　　.//　　　　 ∠ﾆ／　/7\n　　　　　　　　　　　　　　　　School idol project series\n 　　　　　　　　　の「あれはいつまでだっけ？」を記載するファンサイト。LL-Termです");
}, 100);
