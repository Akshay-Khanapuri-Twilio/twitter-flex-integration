exports.handler = async function (context, event, callback) {
  const Twitter = require("twit");
  const twilioConversationService =
    Runtime.getFunctions()["technicalServices/TwilioConversationService"].path;
  const { fetchConversation } = require(twilioConversationService);

  if (event.Source === "SDK") {
    const twitterClient = new Twitter({
      consumer_key: context.TWITTER_CONSUMER_KEY,
      consumer_secret: context.TWITTER_CONSUMER_SECRET,
      access_token: context.TWITTER_ACCESS_TOKEN,
      access_token_secret: context.TWITTER_ACCESS_TOKEN_SECRET,
    });
    const conversationSid = event.ConversationSid;
    const conversation = await fetchConversation(context, conversationSid);
    const twitterID = conversation.uniqueName;
    const messageBody = event.Body;
    await twitterClient.post("direct_messages/events/new", {
      event: {
        type: "message_create",
        message_create: {
          target: {
            recipient_id: twitterID,
          },
          message_data: {
            text: messageBody,
          },
        },
      },
    });
  }

  callback(null, "Ahoy from the Twilio Cloud!");
};
