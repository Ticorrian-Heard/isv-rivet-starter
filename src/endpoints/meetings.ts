import { meetingsS2SOAuthClient, logger, app, db } from '../modules.ts';
import express from 'express';
import { parse } from 'url';

export const startMeetingsEndpoints = () => {
    app.get('/getmeetings', async (req: express.Request, res: express.Response)=>{
        let q = parse(req.url, true).query;

        if (!q.email) {
            res.status(400).send({test_server_error: "'email' query parameter required"});
            return;
        }
        
        try {
          let user = db.data.users.find((obj) => obj.email === <string>q.email);

          if (!user) {
            logger.info(['user ' + q.email + ' not found in db']);
            res.status(404).send({error: q.email + ' not found in db'});
            return;
          } 
          logger.info(['meeting retrieved', user?.meetings]);
          res.status(200).send({success: 'meeting retrieved', response: user?.meetings});
        } catch (err) {
            logger.error([err]);
            res.status(500).send({test_server_error: 'check test server console log'});
        }
    });

    app.post('/createmeeting', async (req: express.Request, res: express.Response)=>{
        let q = parse(req.url, true).query;

        if (!q.email) {
            res.status(400).send({test_server_error: "'email' query parameter required"});
            return;
        }

        //retrieve user from db to get userId
        let user = db.data.users.find((obj) => obj.email === <string>q.email);

        if (!user) {
          res.status(404).send({error: q.email + ' not found in db'});
          return;
        }
        
        let body = (Object.keys(req.body).length > 0) ? req.body : {};
        let path = { userId: <string>user?.zoomId }

        try {
          let responseData: object = await meetingsS2SOAuthClient.endpoints.meetings.createMeeting({ body, path });

          if ((responseData as any).statusCode === 201) {
            //find user from db and add meeting
            let meetingObj = {
              startTime: (responseData as any).data.start_time,
              topic: (responseData as any).data.topic,
              meetingId: (responseData as any).data.id,
              duration: (responseData as any).data.duration,
              joinUrl: (responseData as any).data.join_url,
              startUrl: (responseData as any).data.start_url,
              password: (responseData as any).data.password
            };
            db.update(({ users }) => {
              let user = users.find((obj) => obj.email === <string>q.email);
              if (user) user.meetings?.push(meetingObj) 
                else {
                  logger.info(['user' + q.email + ' not found in db'])
                  res.status(404).send({error: q.email + ' not found in db'});
                  return;
                  };
             });
          }

          logger.info(['meeting created', responseData]);
          res.status(200).send({success: 'meeting created'});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.delete('/deletemeeting', async (req: express.Request, res: express.Response)=>{
        let q = parse(req.url, true).query;
        
        if (!q.email) {
            res.status(400).send({test_server_error: "'email' query parameter required"});
            return;
        }

        let user = db.data.users.find((obj) => obj.email === <string>q.email);

        if (!user) {
          res.status(404).send({error: q.email + ' not found in db'});
          return;
        }

        let meetingId = user?.meetings?.find((mtg) => mtg.meetingId === parseInt(<string>q.meetingId))?.meetingId;

        if (!meetingId) {
          res.status(404).send({error: 'meetingId not found in db for user: ' + user.zoomEmail});
          return;
        }

        let path = { meetingId: meetingId };

        try {
          //delete meeting from user meeting list
          db.update(({ users }) => {
            let user = users.find((obj) => obj.email === <string>q.email); 
            if (user) user.meetings = user.meetings?.filter((mtg) => mtg.meetingId !== path.meetingId);
          });

          let responseData: object = await meetingsS2SOAuthClient.endpoints.meetings.deleteMeeting({ path });
          logger.info(['meeting deleted', responseData]);
          res.status((responseData as any).statusCode).send({success: 'meeting deleted'});
        } catch (err) {
            logger.error([err]);
            res.status(500).send({test_server_error: 'check test server console log'});
        }
    });
};