import { meetingsS2SOAuthClient, logger } from '../modules.ts';

export const startMeetingsEvents = () => {
    const eventHandler = (response: any)=>{
        logger.info(['Event Received', response.payload]);
    };
    meetingsS2SOAuthClient.webEventConsumer.event("meeting.created", eventHandler);
    meetingsS2SOAuthClient.webEventConsumer.event("meeting.deleted", eventHandler);
    meetingsS2SOAuthClient.webEventConsumer.event("meeting.updated", eventHandler);
}