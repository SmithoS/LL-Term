/**
 * 定数クラス
 * javascriptの制約により、かなり無理矢理な形で実装
 */
 class MyConst {

    /** DBに入っている終了日付のフォーマット */
    static get TERM_END_DATE_FORMAT() { return "YYYY-MM-DDTHH:mm"; }

    /** 締切間近と判断する現在日時との差（時間） */
    static get DEADLINE_THRESHOLD_HOURS() { return 48; }

    /** 締切区分：開始前 */
    static get DEADLINE_TYPE_BEFORE_START() { return "01";}
    /** 締切区分：期間中 */
    static get DEADLINE_TYPE_DURING_TERM() { return "02";}
    /** 締切区分：終了直前 */
    static get DEADLINE_TYPE_APPROCHING_DEADLINE() { return "03";}
    /** 締切区分：終了 */
    static get DEADLINE_TYPE_FINISHED() { return "04";}

}

 
module.exports = MyConst;