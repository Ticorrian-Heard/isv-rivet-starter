import { logger, app } from '../modules.ts';
import { KJUR } from 'jsrsasign';
import { parse } from 'url';
import dotenv from 'dotenv';

dotenv.config();

  app.get('/signature', (req, res) => {
    let q = parse(req.url, true).query;

    if (!q.meetingNumber || !q.role) {
      res.status(404).send({error: 'meetingNumber and role parameters required'});
    }
    
    const iat = Math.round((new Date().getTime() - 30000) / 1000);
    const exp = iat + 60 * 60 * 2;
    const oHeader = { alg: 'HS256', 
                      typ: 'JWT' };
  
    const oPayload = {
      sdkKey: process.env.CLIENT_ID,
      mn: <string>q.meetingNumber,
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