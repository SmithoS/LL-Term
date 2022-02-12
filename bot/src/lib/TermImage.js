const moment = require("moment");
const { createCanvas, registerFont } = require("canvas");
const MyConst = require("./MyConst");

// 画像の大きさ
// Twitterアプリでは縦長サムネも使えるが、ブラウザでは横長専用のよう。
// 最大公約数で横長とする
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 675;

// 汎用的なスペース
const COMMON_PADDING_X = 10;
const COMMON_PADDING_Y = 5;

// フォント名
const FONT_NAME = "GenShinGothic";
const FONT_BOLD_NAME = "GenShinGothicBold";

function getDateLabel(contest) {
    let isStarted = true;
    switch (contest.DeadlineType) {
        case MyConst.DEADLINE_TYPE_BEFORE_START:
            label = {
                text: "準備中",
                backColor: "#11ff11",
                frontColor: "#ffffff"
            };
            isStarted = false;
            break;
        case MyConst.DEADLINE_TYPE_DURING_TERM:
            label = {
                text: "開催中",
                backColor: "#1111ff",
                frontColor: "#ffffff"
            };
            isStarted = true;
            break;
        case MyConst.DEADLINE_TYPE_APPROCHING_DEADLINE:
            label = {
                text: "終了間近",
                backColor: "#ff1111",
                frontColor: "#ffffff"
            };
            isStarted = true;
            break;
        case MyConst.DEADLINE_TYPE_FINISHED:
            label = {
                text: "終了",
                backColor: "#999999",
                frontColor: "#ffffff"
            };
            isStarted = true;
            break;
    }

    if (isStarted) {
        const endDateMoment = moment.utc(contest.EndDate, MyConst.TERM_END_DATE_FORMAT);
        label['dateText'] = endDateMoment.format("YYYY/MM/DD HH:mm") + "まで";
    } else {
        const startMoment = moment.utc(contest.StartDate, MyConst.TERM_END_DATE_FORMAT);
        label['dateText'] = startMoment.format("YYYY/MM/DD") + "から";
    }

    return label;
}




class TermImage {

    static createPostVoteTermImage(terms, imageType) {
        const headerText = "ラブライブ！シリーズの投稿企画やその他色々の期間";
        const headerColor = "#f200b5"; // μ's color
        const headerTextColor = "#ffffff";
        return this._createImage(terms, imageType, headerText, headerColor, headerTextColor);
    }

    static createLiveTermImage(terms, imageType) {
        const headerText = "ラブライブ！シリーズのライブ関係の期間";
        const headerColor = "#3299e9"; // Aqours color
        const headerTextColor = "#ffffff";
        return this._createImage(terms, imageType, headerText, headerColor, headerTextColor);
    }

    static createShopTermImage(terms, imageType) {
        const headerText = "ラブライブ！シリーズの店舗、コラボショップの期間";
        const headerColor = "#ffc000"; // 虹ヶ咲 color
        const headerTextColor = "#ffffff";
        return this._createImage(terms, imageType, headerText, headerColor, headerTextColor);
    }

    static createItemTermImage(terms, imageType) {
        const headerText = "ラブライブ！シリーズの商品の予約期間";
        const headerColor = "#8b4993"; // Liella! color
        const headerTextColor = "#ffffff";
        return this._createImage(terms, imageType, headerText, headerColor, headerTextColor);
    }

    /**
     * 画像Buffer作成処理
     * @param {*} inputTerms 
     * @param {*} imageType 
     * @param {*} headerText 
     * @param {*} headerColor 
     * @param {*} headerTextColor
     * @returns 
     */
    static _createImage(inputTerms, imageType, headerText, headerColor, headerTextColor) {

        // 各種定数
        const HEADER_HEIGHT = 55;
        const CONTEST_NAME_HEIGHT = 32;
        const CONTEST_MARGIN_Y = COMMON_PADDING_Y * 2.5;
        const LABEL_WIDTH = 100;
        const LABEL_HEIGHT = 28;
        const CONTEST_INFO_HEIGHT = CONTEST_NAME_HEIGHT + LABEL_HEIGHT + COMMON_PADDING_Y + CONTEST_MARGIN_Y;

        // 表示可能件数（最終行は 2/3 映ればOKとする）
        const maxDisplayCount = Math.floor(((CANVAS_HEIGHT - HEADER_HEIGHT) / CONTEST_INFO_HEIGHT) + 0.3);

        // 期間すべての表示は厳しいので表示可能件数だけ抽出する
        let terms = inputTerms;
        let isExitOtherTerms = false;
        if (terms.length > maxDisplayCount) {
            isExitOtherTerms = true;
            const getDeadlineSort = (type) => {
                let rtn = 99;
                switch (type) {
                    case MyConst.DEADLINE_TYPE_APPROCHING_DEADLINE:
                        rtn = 1;
                        break;
                    case MyConst.DEADLINE_TYPE_DURING_TERM:
                        rtn = 2;
                        break;
                    case MyConst.DEADLINE_TYPE_BEFORE_START:
                        rtn = 3;
                        break;
                    case MyConst.DEADLINE_TYPE_FINISHED:
                        rtn = 4;
                        break;                        
                }
                return rtn;
            }

            terms.sort((a, b) => {
                const aDeadline = getDeadlineSort(a.DeadlineType);
                const bDeadline = getDeadlineSort(b.DeadlineType);
                if (aDeadline != bDeadline) return  aDeadline - bDeadline;
                return a.EndDate.localeCompare(b.EndDate, "en");
            });
            terms = terms.slice(0, maxDisplayCount);
        }


        // フォントの登録。非日本語環境だと必須
        // createCanvas前に実行する必要あり
        registerFont('./font/genshingothic/GenShinGothic-Normal.ttf', { family: FONT_NAME });
        registerFont('./font/genshingothic/GenShinGothic-Bold.ttf', { family: FONT_BOLD_NAME });

        // 真っ白のキャンバスを用意
        const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        const context = canvas.getContext("2d");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);


        // ヘッダーを描写
        context.fillStyle = headerColor;
        context.fillRect(0, 0, CANVAS_WIDTH, HEADER_HEIGHT);
        context.fillStyle = headerTextColor;
        context.font = `33px "${FONT_NAME}"`;
        context.textBaseline = "bottom";
        context.textAlign = "left";
        context.fillText(headerText, COMMON_PADDING_X, HEADER_HEIGHT - COMMON_PADDING_Y);

        const nowText = moment.utc().add(9, "hours").format("YYYY/MM/DD HH:mm");
        context.fillStyle = headerTextColor;
        context.font = `20px "${FONT_NAME}"`;
        context.textBaseline = "bottom";
        context.textAlign = "right";
        context.fillText(nowText, CANVAS_WIDTH - COMMON_PADDING_X, HEADER_HEIGHT - COMMON_PADDING_Y);


        // コンテスト情報を記載
        context.textAlign = "left";
        context.textBaseline = "top";
        for (let i = 0; i < terms.length; i++) {
            const contest = terms[i];
            // 名前を描写
            const nameY = HEADER_HEIGHT + COMMON_PADDING_X + CONTEST_INFO_HEIGHT * i;
            context.fillStyle = "#000000";
            context.font = `26px "${FONT_NAME}"`;
            context.textBaseline = "top";
            context.textAlign = "left";
            context.fillText(contest.Name, COMMON_PADDING_X, nameY);

            // ラベルを描写
            const label = getDateLabel(contest);
            context.fillStyle = label.backColor;
            const x = COMMON_PADDING_X;
            const y = nameY + CONTEST_NAME_HEIGHT + COMMON_PADDING_Y;
            const r = LABEL_HEIGHT / 2;
            context.beginPath();
            context.moveTo(x + r, y);
            context.lineTo(x + LABEL_WIDTH - r, y);
            context.arc(x + LABEL_WIDTH - r, y + r, r, Math.PI * (3/2), Math.PI * (1/2), false);
            context.lineTo(x + r, y + (r * 2));
            context.arc(x + r, y + r, r, Math.PI * (1/2), Math.PI * (3/2), false);
            context.closePath();
            context.fill();
            context.fillStyle = label.frontColor;
            context.font = `20px "${FONT_BOLD_NAME}"`;
            context.textBaseline = "middle";
            context.textAlign = "center";
            context.fillText(label.text, x + (LABEL_WIDTH / 2), y + r);

            // 期日を描写
            context.fillStyle = "#333333";
            context.font = `20px "${FONT_NAME}"`;
            context.textBaseline = "middle";
            context.textAlign = "left";
            context.fillText(label.dateText, x + LABEL_WIDTH + COMMON_PADDING_X, y + r);
        }

        // if (isExitOtherTerms) {
        //     context.fillStyle = "#333333";
        //     context.font = `20px "${FONT_NAME}"`;
        //     context.textBaseline = "bottom";
        //     context.textAlign = "right";
        //     context.fillText("ほか", CANVAS_WIDTH - COMMON_PADDING_X, CANVAS_HEIGHT - COMMON_PADDING_Y);
        // }

        const buffer = canvas.toBuffer(`image/${ imageType }`);
        return buffer;
    }
}

module.exports = TermImage;
