const AWS = require('aws-sdk');
const moment = require("moment");
const MyConst = require("./MyConst");

const TABLE_NAME = "LL-Term";
const INDEX_NAME = "Type-EndDate-index";

const KIND_POST_VOTE_TERM = "term";
const KIND_LIVE = "live";
const KIND_SHOP = "shop";
const KIND_ITEM = "item";

function setDeadlineType(terms) {
    // 現在日時
    const now = moment.utc().add(9, "hours");

    for (let t of terms) {
        const startDateMoment = moment.utc(t.StartDate, MyConst.TERM_END_DATE_FORMAT);
        const endDateMoment = moment.utc(t.EndDate, MyConst.TERM_END_DATE_FORMAT);
        const diffEndHours = endDateMoment.diff(now, "hours");

        let deadlineType = "";
        if (startDateMoment.isAfter(now)) {
            deadlineType = MyConst.DEADLINE_TYPE_BEFORE_START;
        } else if (diffEndHours < 0) {
            deadlineType = MyConst.DEADLINE_TYPE_FINISHED;
        } else if (diffEndHours < MyConst.DEADLINE_THRESHOLD_HOURS) {
            deadlineType = MyConst.DEADLINE_TYPE_APPROCHING_DEADLINE;
        } else {
            deadlineType = MyConst.DEADLINE_TYPE_DURING_TERM;
        }
        t['DeadlineType'] = deadlineType;
    }
}

async function getData(dateMoment, type, isContainFutureData) {
    const dynamo = new AWS.DynamoDB.DocumentClient();
    const table = TABLE_NAME;
    const index = INDEX_NAME;

    // DynamoDBのクエリ条件
    const params = {
        TableName: table,
        IndexName: index,
        KeyConditionExpression: '#pk = :pkVal AND #sk >= :skVal',
        ExpressionAttributeNames: {
            "#pk": "Type",
            "#sk": "EndDate"
        },
        ExpressionAttributeValues: {
            ":pkVal": type,
            ":skVal": dateMoment.format(MyConst.TERM_END_DATE_FORMAT)
        }
    };

    const result = await dynamo.query(params).promise();
    let datas = result.Items;
    setDeadlineType(datas);

    if (!isContainFutureData) {
        datas = datas.filter((d) => {
            return d.DeadlineType != MyConst.DEADLINE_TYPE_BEFORE_START;
        });
    }

    return datas;
}



class TermDB {
    static async getPostVoteTermList(dateMoment) {
        return await getData(dateMoment, KIND_POST_VOTE_TERM, false);
    }

    static async getLiveTermList(dateMoment) {
        return await getData(dateMoment, KIND_LIVE, false);
    }

    static async getShopTermList(dateMoment) {
        return await getData(dateMoment, KIND_SHOP, false);
    }

    static async getItemTermList(dateMoment) {
        return await getData(dateMoment, KIND_ITEM, false);
    }
}

module.exports = TermDB;