const TweetTerm = require("./src/TweetTerm");

exports.handler = async (event) => {
  const type = event.callType;

  if (type == "list") {
    await TweetTerm.tweetTermList();

  } else if (type == "deadline") {
    await TweetTerm.tweetDeadlineTerm();

  } else {
    console.log("call type is not defined. > " + type)
  }
};

