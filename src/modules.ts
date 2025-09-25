//TODO import the Rivet SDK Module you want to use
import { PhoneS2SAuthClient, ConsoleLogger } from "@zoom/rivet/phone";

import express from 'express';
import dotenv from 'dotenv';
import { JSONFileSyncPreset } from 'lowdb/node'

//TODO import the Zoom Phone REST API Endpoints and Webhook Listeners to start
import { startPhoneEndpoints } from "./endpoints/phone";
import { startPhoneEvents } from "./events/phone_events";

//server config
export const app: express.Application = express();
app.use(express.json());
dotenv.config();
const exPort: number = parseInt(process.argv[2] || <string>process.env.SERVER_PORT);

//db config
type Call = {
    callId: string,
    callLogs?: any[]
};
type Data = {
    logs: Call[]
};
const defaultData: Data = { logs: [] };
export const db = JSONFileSyncPreset<Data>(('db.json'), defaultData);

//TODO Module config
export const phoneS2SOAuthClient = new PhoneS2SAuthClient({
    clientId: <string>process.env.StS_CLIENT_ID,
    clientSecret: <string>process.env.StS_CLIENT_SECRET,
    webhooksSecretToken: <string>process.env.StS_WEBHOOK_SECRET_TOKEN,
    accountId: <string>process.env.ACCOUNT_ID,
    port: exPort + 1 //port 5011 <- use this port for ngrok and Endpoint URL on Marketplace
});

//TODO instantiate rivet logger 
export const logger = new ConsoleLogger();

//TODO implement our server startup 
export const startModules = async () => {
    await phoneS2SOAuthClient.start();
};

export const startEndpoints = () => {
    startPhoneEndpoints();
};

export const startEvents = () => {
    startPhoneEvents();
};