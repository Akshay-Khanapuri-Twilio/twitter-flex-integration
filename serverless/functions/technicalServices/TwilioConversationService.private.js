const createConversation = async (context, senderID) => {
  try {
    const client = context.getTwilioClient();
    const conversation = await client.conversations.v1.conversations.create({
      uniqueName: senderID,
    });
    return conversation;
  } catch (error) {
    console.log(
      `Conversation creation failed  with the following error: ${error.message}`
    );
    return error;
  }
};

const fetchConversation = async (context, senderID) => {
  try {
    const client = context.getTwilioClient();
    let conversation = await client.conversations.v1
      .conversations(senderID)
      .fetch();
    return conversation;
  } catch (error) {
    console.log(
      `Failed to fetch the Conversations with the following error: ${error.message}`
    );
    return error;
  }
};

const addWebhook = async (context, conversationSid) => {
  try {
    const client = context.getTwilioClient();
    const webhook = await client.conversations.v1
      .conversations(conversationSid)
      .webhooks.create({
        "configuration.method": "POST",
        "configuration.filters": ["onMessageAdded"],
        "configuration.url": `https://${context.DOMAIN_NAME}/fromFlex`,
        target: "webhook",
      });
    return webhook;
  } catch (error) {
    console.log(
      `Failed to add the webhook with the following error:${error.message}`
    );
    return error;
  }
};

const createParticipant = async (context, conversationSid, senderID) => {
  try {
    const client = context.getTwilioClient();
    const participant = await client.conversations.v1
      .conversations(conversationSid)
      .participants.create({ identity: senderID });
    return participant;
  } catch (error) {
    console.log(
      `Participant creation failed  with the following error: ${error.message}`
    );
    return error;
  }
};

const createMessage = async (
  context,
  conversationSid,
  messageBody,
  senderName
) => {
  try {
    const client = context.getTwilioClient();
    const message = await client.conversations.v1
      .conversations(conversationSid)
      .messages.create({ author: senderName, body: messageBody });
    return message;
  } catch (error) {
    console.log(
      `Failed to send message with the following error: ${error.message}`
    );
    return error;
  }
};

const updateConversation = async (
  context,
  conversationSid,
  interactionSid,
  interactionChannelSid
) => {
  try {
    const client = context.getTwilioClient();
    const conversation = await client.conversations.v1
      .conversations(conversationSid)
      .update({
        attributes: JSON.stringify({
          interactionSid: interactionSid,
          interactionChannelSid: interactionChannelSid,
        }),
      });
    return conversation;
  } catch (error) {
    console.log(
      `Failed to update the Conversation attributes with the following error: ${error.message}`
    );
    return error;
  }
};

module.exports = {
  createConversation,
  fetchConversation,
  addWebhook,
  createParticipant,
  createMessage,
  updateConversation,
};
