import { InformationEvent } from 'http';
import { SuccessResponse } from '../../helpers';
import { ContextInterface } from '../../interfaces';
import { Guard } from '../../middlewares';
// import { WebsocketNotification } from '../../utils';

export const publishSanitizedMessageResolvers = {
  Query: {
    publishSanitizedMessage: async (
      parent: ParentNode,
      args: undefined,
      contextValue: ContextInterface,
      info: InformationEvent,
    ) => {
      const workspace = Guard.grantWorkspace(contextValue.workspace);
      Guard.grant(contextValue.user);
      const message = [`sanitization completed for workspace: ${workspace.label}`];
      // const notificationDetails = await new SanitizedNotificationService().findOne({ workspaceId });
      // const notification = 
      // await new WebsocketNotification().sendNotification(workspace.id, [message]);
      // if (notification) {
      //   await new SanitizedNotificationService().deleteOne(notificationDetails.id);
      // }
      return SuccessResponse.send({
        message: `Sanitization Message published to ${workspace.id}`,
        data: { message }
      });
    },
  },
};