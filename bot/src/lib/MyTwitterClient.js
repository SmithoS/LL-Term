const { TwitterApi } = require("twitter-api-v2");

function getClient() {
    return new TwitterApi({
        appKey: process.env.TWITTER_CONSUMER_KEY,
        appSecret: process.env.TWITTER_CONSUMER_SECRET,
        accessToken: process.env.LL_TERM_ACCESS_TOKEN,
        accessSecret: process.env.LL_TERM_ACCESS_TOKEN_SECRET,
    });
}


class MyTwitterClient {

    /**
     * テキストのみのツイート
     * @param {*} text 本文
     * @returns 
     */
    static async tweetText(text) {
        const client = getClient();
        return await client.v2.tweet(text);
    }

    /**
     * メディア付きツイート
     * @param {*} text 本文
     * @param {*} fileBufferList 
     * @param {*} fileType 
     * @returns 
     */
    static async tweetMedia(text, fileBufferList, fileType) {
        const client = getClient();

        // メディアをアップロード
        let mediaIdList = [];
        for (const fb of fileBufferList) {
            const mediaId = await client.v1.uploadMedia(fb, { type: fileType });
            mediaIdList.push(mediaId);
        }
        
        // ツイート
        return await client.v2.tweet(text, {
            media: {
                media_ids: mediaIdList
            }
        });
    }


    // /**
    //  * 投票付きツイート
    //  * @param {*} text 本文
    //  * @param {*} durationMinutes 投票の期間（分）
    //  * @param {*} pollOptions 投票の選択肢。配列で指定する
    //  */
    // static async tweetPoll(text, durationMinutes, pollOptions) {
    //     const client = getClient();

    //     return await client.v2.tweet(text, {
    //         poll: {
    //             duration_minutes: durationMinutes, 
    //             options:pollOptions
    //         }
    //     });
    // }

}

module.exports = MyTwitterClient;