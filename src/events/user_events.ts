import { usersS2SOAuthClient, logger } from '../modules.ts';

export const startUserEvents = () => { 
   const eventHandler = (response: any)=>{
        logger.info(['Event Received', response.payload]);
   };
   usersS2SOAuthClient.webEventConsumer.event("user.created", eventHandler);
   usersS2SOAuthClient.webEventConsumer.event("user.deleted", eventHandler);
   usersS2SOAuthClient.webEventConsumer.event("user.updated", eventHandler);
}
    