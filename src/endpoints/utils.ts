import { logger, app } from '../modules.ts';
import { KJUR } from 'jsrsasign';
import { parse } from 'url';
import dotenv from 'dotenv';

dotenv.config();

export const startUtils = () => {
  app.get('/signature', (req, res) => {
    let q = parse(req.url, true).query;

    if (Object.keys(req.body).length === 0 && (!q.meetingId || !q.role)) {
      res.status(404).send({error: 'meetingId and role parameters required if request body payload is not provided'});
    }

    const iat = Math.round((new Date().getTime() - 30000) / 1000);
    const exp = iat + 60 * 60 * 2;
    const oHeader = { alg: 'HS256', 
                      typ: 'JWT' };
  
    const oPayload = (Object.keys(req.body).length > 0) ? req.body : {
      sdkKey: process.env.CLIENT_ID,
      mn: <string>q.meetingId,
      role: <string>q.role,
      iat: iat,
      exp: exp,
      tokenExp: iat + 60 * 60 * 2
    };
  
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(oPayload);
    const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, process.env.CLIENT_SECRET);
  
    logger.info(["signature generated", sdkJWT]);
    res.status(201).send({ signature: sdkJWT });
  });
};