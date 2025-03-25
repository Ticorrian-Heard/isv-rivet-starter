import { UsersS2SAuthClient, ConsoleLogger } from "@zoom/rivet/users";
import { MeetingsS2SAuthClient } from "@zoom/rivet/meetings";
import { AccountsS2SAuthClient } from "@zoom/rivet/accounts";
import { startUserEndpoints } from "./endpoints/users";
import { startUserEvents } from "./events/user_events";
import { startMeetingsEndpoints } from "./endpoints/meetings";
import { startMeetingsEvents } from "./events/meetings_events";
import express from 'express';
import dotenv from 'dotenv';
import { JSONFileSyncPreset } from 'lowdb/node'

//server config
export const app: express.Application = express();
app.use(express.json());
dotenv.config();
const exPort: number = parseInt(process.argv[2] || <string>process.env.SERVER_PORT);

//db config
type Meeting = {
    startTime: string,
    topic: string,
    meetingId: number,
    duration: number,
    joinUrl: string,
    startUrl: string,
    password?: string
}
type User = {
    email: string,
    zoomId: string,
    zoomEmail: string,
    meetings?: Meeting[]
};
type Data = {
    users: User[]
};
const defaultData: Data = { users: [] };
export const db = JSONFileSyncPreset<Data>(('db.json'), defaultData);

//module config
export const usersS2SOAuthClient = new UsersS2SAuthClient({
    clientId: <string>process.env.StS_CLIENT_ID,
    clientSecret: <string>process.env.StS_CLIENT_SECRET,
    webhooksSecretToken: <string>process.env.StS_WEBHOOK_SECRET_TOKEN,
    accountId: <string>process.env.ACCOUNT_ID,
    port: exPort + 1
});

export const meetingsS2SOAuthClient = new MeetingsS2SAuthClient({
    clientId: <string>process.env.StS_CLIENT_ID,
    clientSecret: <string>process.env.StS_CLIENT_SECRET,
    webhooksSecretToken: <string>process.env.StS_WEBHOOK_SECRET_TOKEN,
    accountId: <string>process.env.ACCOUNT_ID,
    port: exPort + 2
});
  
export const accountsS2SOAuthClient = new AccountsS2SAuthClient({
    clientId: <string>process.env.StS_CLIENT_ID,
    clientSecret: <string>process.env.StS_CLIENT_SECRET,
    webhooksSecretToken: <string>process.env.StS_WEBHOOK_SECRET_TOKEN,
    accountId: <string>process.env.ACCOUNT_ID,
    port: exPort + 3
});

export const logger = new ConsoleLogger();


//server startup 
export const startModules = async () => {
    await usersS2SOAuthClient.start();
    await meetingsS2SOAuthClient.start();
    await accountsS2SOAuthClient.start();
};

export const startEndpoints = () => {
    startUserEndpoints();
    startMeetingsEndpoints();
};

export const startEvents = () => {
    startUserEvents();
    startMeetingsEvents();
};