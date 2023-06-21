exports.handler = async function (context, event, callback) {
  const orchestratorService =
    Runtime.getFunctions()["orchestrationService"].path;
  const { orchestrator } = require(orchestratorService);
  const messageBody =
    event?.direct_message_events[0]?.message_create?.message_data?.text;
  const senderID = event?.direct_message_events[0]?.message_create?.sender_id;
  const senderName = event?.apps[senderID]?.name;
  await orchestrator(context, messageBody, senderID, senderName);
  callback(null, "Ahoy from the Twilio Cloud!");
};
