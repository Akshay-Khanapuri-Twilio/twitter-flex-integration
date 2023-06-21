const twilioConversationService =
  Runtime.getFunctions()["technicalServices/TwilioConversationService"].path;
const {
  createConversation,
  fetchConversation,
  addWebhook,
  createParticipant,
  createMessage,
  updateConversation,
} = require(twilioConversationService);

const twilioInteractionService =
  Runtime.getFunctions()["technicalServices/TwilioInteractionService"].path;
const {
  createInteraction,
  fetchNoOfParticipants,
  createInvite,
} = require(twilioInteractionService);

const orchestrator = async (context, messageBody, senderID, senderName) => {
  /**
   * Check if there already exists a converation for the inbound message from twitter
   */

  let conversation = await fetchConversation(context, senderID);

  if (conversation instanceof Error && conversation?.status === 404) {
    /**
     *  Conversation does not exist for the inbound message from twitter. Creating a new conversation
     */
    conversation = await createConversation(context, senderID);
    const conversationSid = conversation.sid;

    /**
     *  Add a conversation scoped webhook which monitors the messages received from Flex
     */
    const webhook = await addWebhook(context, conversationSid);

    /**
     *  Create participant representing the twitter DM sender inside the newly created conversation
     */
    const participant = await createParticipant(
      context,
      conversationSid,
      senderID
    );

    /**
     *  Add the DM received from twitter to the conversation
     */
    const message = await createMessage(
      context,
      conversationSid,
      messageBody,
      senderName
    );

    /**
     *  Create an interaction
     */
    const interaction = await createInteraction(
      context,
      conversationSid,
      senderID,
      senderName
    );
    const interactionSid = interaction.sid;
    const interactionChannelSid = interaction.channel.sid;

    /**
     *  Update the conversation with Interaction info
     */
    conversation = await updateConversation(
      context,
      conversationSid,
      interactionSid,
      interactionChannelSid
    );
  } else {
    /**
     *  There already exists a conversation for the inbound message. Check if the conversation is active on Flex UI
     */
    const fetchConversationResult = await fetchConversation(context, senderID);
    const conversationSid = fetchConversationResult.sid;
    const { interactionSid, interactionChannelSid } = JSON.parse(
      fetchConversationResult.attributes
    );
    const fetchNoOfParticipantsResult = await fetchNoOfParticipants(
      context,
      interactionSid,
      interactionChannelSid
    );
    if (fetchNoOfParticipantsResult.length === 2) {
      /**
       *  The conversation is active in Flex UI. Send message to the existing conversation
       */
      const message = await createMessage(
        context,
        conversationSid,
        messageBody,
        senderName
      );
    } else {
      /**
       *  The conversation is not active on Flex UI. Send the message to the existing conversation and create a new invite
       */
      const message = await createMessage(
        context,
        conversationSid,
        messageBody,
        senderName
      );

      const invite = await createInvite(
        context,
        senderID,
        interactionSid,
        interactionChannelSid,
        senderName
      );
    }
  }
};

module.exports = {
  orchestrator,
};
