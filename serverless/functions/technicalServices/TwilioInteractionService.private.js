const createInteraction = async (
  context,
  conversationSid,
  senderID,
  senderName
) => {
  try {
    const client = context.getTwilioClient();
    const interaction = await client.flexApi.v1.interaction.create({
      channel: {
        type: "chat",
        initiated_by: "api",
        properties: {
          type: "chat",
          media_channel_sid: conversationSid,
          participants: [],
        },
      },
      routing: {
        type: "TaskRouter",
        properties: {
          workspace_sid: context.WORKSPACE_SID,
          workflow_sid: context.WORKFLOW_SID,
          task_channel_sid: context.CHAT_TASK_CHANNEL_SID,
          attributes: {
            customerId: senderID,
            customTaskType: "twitter",
            name: senderName,
          },
        },
      },
    });
    return interaction;
  } catch (error) {
    console.log(
      `Interaction creation failed with the following error: ${error.message}`
    );
    return error;
  }
};

const fetchNoOfParticipants = async (
  context,
  interactionSid,
  interactionChannelSid
) => {
  try {
    const client = context.getTwilioClient();
    const participantList = await client.flexApi.v1
      .interaction(interactionSid)
      .channels(interactionChannelSid)
      .participants.list({ limit: 20 });
    return participantList;
  } catch (error) {
    console.log(
      `Failed to fetch the number of participants with the following eror: ${error.message}`
    );
    return error;
  }
};

const createInvite = async (
  context,
  senderID,
  interactionSid,
  interactionChannelSid,
  senderName
) => {
  try {
    const client = context.getTwilioClient();
    const invite = await client.flexApi.v1
      .interaction(interactionSid)
      .channels(interactionChannelSid)
      .invites.create({
        routing: {
          properties: {
            workspace_sid: context.WORKSPACE_SID,
            workflow_sid: context.WORKFLOW_SID,
            task_channel_sid: context.CHAT_TASK_CHANNEL_SID,
            attributes: {
              customerId: senderID,
              customTaskType: "twitter",
              name: senderName,
            },
          },
        },
      });
    return invite;
  } catch (error) {
    console.log(
      `Failed to Create Invite with the following error: ${error.message}`
    );
    return error;
  }
};

module.exports = {
  createInteraction,
  fetchNoOfParticipants,
  createInvite,
};
