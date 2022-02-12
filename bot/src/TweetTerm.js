const moment = require("moment");
const MyTwitterClient = require("./lib/MyTwitterClient");
const TermImage = require("./lib/TermImage");
const TermDB = require("./lib/TermDB");
const MyConst = require("./lib/MyConst");

class TweetTerm {
    
    /**
     * 期間の一覧をつぶやく
     */
    static async tweetTermList() {

        // 現在日時
        const now = moment.utc().add(9, "hours"); // 強制的に日本時刻に変換

        // 表示する期間の一覧を取得
        const postVoteData = await TermDB.getPostVoteTermList(now);
        const liveData = await TermDB.getLiveTermList(now);
        const shopData = await TermDB.getShopTermList(now);
        const itemData = await TermDB.getItemTermList(now);

        // 投稿イメージを作成
        const imageType= "png";
        let postVoteImgBuffer = null;
        let liveImgBuffer = null;
        let shopImgBuffer = null;
        let itemImgBuffer = null;
        if (postVoteData != null && postVoteData.length > 0) {
            postVoteImgBuffer = TermImage.createPostVoteTermImage(postVoteData, imageType);
        }
        if (liveData != null && liveData.length > 0) {
            liveImgBuffer = TermImage.createLiveTermImage(liveData, imageType);
        }
        if (shopData != null && shopData.length > 0) {
            shopImgBuffer = TermImage.createShopTermImage(shopData, imageType);
        }
        if (itemData != null && itemData.length > 0) {
            itemImgBuffer = TermImage.createItemTermImage(itemData, imageType);
        }


        if (postVoteImgBuffer == null && liveImgBuffer == null && shopImgBuffer == null) {

            console.log("期間でつぶやく対象が存在しませんでした。");

        } else {
            // 投稿イメージを設定
            let imgBufferList = [];
            if (liveImgBuffer != null) imgBufferList.push(liveImgBuffer);
            if (shopImgBuffer != null) imgBufferList.push(shopImgBuffer);
            if (itemImgBuffer != null) imgBufferList.push(itemImgBuffer);
            if (postVoteImgBuffer != null) imgBufferList.push(postVoteImgBuffer);
            
            // ツイートの文章を作成
            let ary = [];
            ary.push("ラブライブ！シリーズの開催中の期間です。");
            ary.push("各種詳細や今後の開催予定についてはWebページをご確認ください。");
            ary.push("https://ll-term.link/");
            ary.push("");
            ary.push("（" + now.format("YYYY/MM/DD HH:mm") + "） #lovelive #LLTerm");

            // ツイート
            await MyTwitterClient.tweetMedia(ary.join("\n"), imgBufferList, imageType);
        }
    }



    /**
     * 終了間近な期間をつぶやく
     */
    static async tweetDeadlineTerm() {
        // 現在日時
        const now = moment.utc().add(9, "hours"); // 強制的に日本時刻に変換

        // 表示する期間の一覧を取得
        const postVoteData = await TermDB.getPostVoteTermList(now) || [];
        const liveData = await TermDB.getLiveTermList(now) || [];
        const shopData = await TermDB.getShopTermList(now) || [];
        const itemData = await TermDB.getItemTermList(now) || [];

        let data = postVoteData.concat(liveData).concat(shopData).concat(itemData);

        // 締切間近だけ抽出
        data = data.filter((d) => {
            return d.DeadlineType == MyConst.DEADLINE_TYPE_APPROCHING_DEADLINE;
        });

        for (const d of data) {
            const endDateMoment = moment.utc(d.EndDate, MyConst.TERM_END_DATE_FORMAT);
            const endDateStr = endDateMoment.format("YYYY/MM/DD HH:mm");
            const diffEndMinutes = endDateMoment.diff(now, "minutes");
            let lastTimeStr = "";
            if (diffEndMinutes >= 24 * 60) {
                lastTimeStr = `【あと${Math.floor(diffEndMinutes / (24 * 60))}日】`;
            } else if (diffEndMinutes >= 60) {
                lastTimeStr = `【あと${Math.floor(diffEndMinutes / 60)}時間】`;
            } else {
                lastTimeStr = `【あと${diffEndMinutes}分】`;
            }

            // ツイートの文章を作成
            let ary = [];
            ary.push(lastTimeStr + d.Name);
            ary.push("期間は" + endDateStr + "まで！");
            ary.push(d.URL);
            ary.push("");
            ary.push("（" + now.format("YYYY/MM/DD HH:mm") + "） #lovelive #LLTerm");
            
            // ツイート
            await MyTwitterClient.tweetText(ary.join("\n"));
        }
    }
}

module.exports = TweetTerm;