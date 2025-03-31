import { usersS2SOAuthClient, logger, app, db } from '../modules.ts';
import express from 'express';
import { parse } from 'url';

export const startUserEndpoints = () => {
    app.get('/getuser', async (req: express.Request, res: express.Response)=>{
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

          res.status(200).send({success: 'user retrieved', response: user});
        } catch (err) {
            logger.error([err]);
            res.status(500).send({test_server_error: 'check test server console log'});
        }
    });

    app.post('/createuser', async (req: express.Request, res: express.Response)=>{
       
        let q = parse(req.url, true).query;

        if (!q.email) {
            res.status(400).send({test_server_error: "'email' query parameter required"});
            return;
        }

        let splitEmail = (q.email as string).split('@');

        let body = {
            action: 'custCreate',
            user_info: {
              email: btoa(splitEmail[0]) + '@isv.' + splitEmail[1],
              type: 2,
            }
        };
    
        try {
          let responseData: object = await usersS2SOAuthClient.endpoints.users.createUsers({ body });

          if ((responseData as any).statusCode === 201) {
            //map zoom userid and email to given user email 
            let userObj = {
              zoomId: (responseData as any).data.id,
              zoomEmail: (responseData as any).data.email,
              meetings: []
            };

            db.update(({ users }) => {
              let user = users.find((obj) => obj.email === <string>q.email); 
              (user) ? Object.assign(user, userObj) : users.push({ email: <string>q.email, ...userObj});
             });
          }

          logger.info(['Cust User created', responseData]);
          res.status((responseData as any).statusCode).send({success: 'user created'});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });
    
    app.delete('/deleteuser', async (req: express.Request, res: express.Response)=>{
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
        
        let path = { userId: <string>user.zoomId }
        let query = {
            action: "delete"
        }
    
        try {
          //delete zoom email and id from user mapping in db
          let userObj = {
            zoomId: '',
            zoomEmail: '',
            meetings: []
          };
          db.update(({ users }) => {
            let user = users.find((obj) => obj.zoomId === <string>path.userId); 
            (user) ? Object.assign(user, userObj) : logger.info(['user' + path.userId + ' not found in db']);
          });

          let responseData: object = await usersS2SOAuthClient.endpoints.users.deleteUser({ path, query });
          logger.info(['user deleted', responseData]);
          res.status((responseData as any).statusCode).send({success: 'user deleted'})
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });
};

