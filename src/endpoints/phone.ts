import { PhoneNumbersAssignPhoneNumberToUserPathParams, PhoneNumbersAssignPhoneNumberToUserRequestBody, 
  UsersAssignCallingPlanToUserPathParams, UsersAssignCallingPlanToUserRequestBody } from '@zoom/rivet/phone';
import { phoneS2SOAuthClient, logger, app} from '../modules.ts';
import express from 'express';
import { parse } from 'url';

export const startPhoneEndpoints = () => {
    app.post('/assigncallplan', async (req: express.Request, res: express.Response) => {
        let q = parse(req.url, true).query;
    
        if (!q.userId) {
            res.status(400).send({test_server_error: "'userId' query parameter required"});
            return;
        }
        
        //Rivet objects follow the Request Body schema required by its corresponding Zoom REST Endpoint
        let path: UsersAssignCallingPlanToUserPathParams = { userId: <string>q.userId }
        let body: UsersAssignCallingPlanToUserRequestBody = {
          calling_plans: [
              {
                "type": parseInt(<string>q.type),
                "billing_account_id": <string>q.accountId
              }
          ]
        };
    
        try {
          //Rivet makes the API call and handlers the response structuring under the hood
          let responseData: object = await phoneS2SOAuthClient.endpoints.users.assignCallingPlanToUser({ body, path });
    
          logger.info(['calling plan assigned', (responseData as any).data]);
          res.status(200).send({success: responseData});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });
    
    app.get('/listphonenumbers', async (req: express.Request, res: express.Response) => {
        try {
          let responseData: object = await phoneS2SOAuthClient.endpoints.phoneNumbers.listPhoneNumbers({});
          res.status(200).send({success: responseData});
        } catch (err) {
            logger.error([err]);
            res.status(400).send({test_server_error: 'check test server console log'});
        }
    });

    app.post('/assignphonenumber', async (req: express.Request, res: express.Response) => {
      let q = parse(req.url, true).query;

      if (!q.userId) {
          res.status(400).send({test_server_error: "'userId' query parameter required"});
          return;
      }
      
      let path: PhoneNumbersAssignPhoneNumberToUserPathParams = { userId: <string>q.userId }
      let body: PhoneNumbersAssignPhoneNumberToUserRequestBody = {
        phone_numbers: [
            {
              "id": <string>q.id,
              "number": <string>q.number
            }
        ]
      };

      try {
        let responseData: object = await phoneS2SOAuthClient.endpoints.phoneNumbers.assignPhoneNumberToUser({ body, path });

        logger.info(['phone number assigned', (responseData as any).data]);
        res.status(200).send({success: responseData});
      } catch (err) {
          logger.error([err]);
          res.status(400).send({test_server_error: 'check test server console log'});
      }
  });
};