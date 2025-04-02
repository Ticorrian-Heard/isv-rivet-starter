This Sample App was built to help Zoom ISV Customers seamlessly start building their integration in compliance with the Zoom ISV guidelines. This server is powered by the Zoom Rivet SDK which offers streamlined methods for using Zoom Rest APIs, Methods for Event Listeners, and OAuth Handling under the hood.
 
Use of this Sample App is subject to Zoom [Terms of Use](https://www.zoom.com/en/trust/terms/).

## Installation

Clone this repo into your local enviroment:
```
$ git clone https://github.com/Ticorrian-Heard/isv-rivet-starter.git
```

Once cloned, cd into the directory and install the npm packages: 
```
$ npm install
```

Run the application with this command
```
$ npm run start
```

## Configuration
You will need to build a [Server-to-Server](https://developers.zoom.us/docs/internal-apps/create/) OAuth app on the Zoom Marketplace. From there, you will receive the following credentials: 
- Server-to-Server (S2SOAuth) Client ID and Client Secret
- S2S Webhook Secret Token
- Account ID

## Usage
The sample app follows this basic workflow for creating, retrieving, and deleting Zoom custCreate users and Zoom meetings. It uses lowdb as a local store for user data which can be edited in the `db.json` file. You can also replace this db with your own.

<img width="722" alt="Image" src="https://github.com/user-attachments/assets/0c36c078-ba23-4839-a742-622117bf3832" />


Once the server is running, it will listen on the specified port and you can now make REST API calls to its endpoints.

User Endpoints
- POST /localhost:port/createuser?email=<email> 
- GET /localhost:port/getuser?email=<email>
- GET /localhost:port/getuserzak?email=<email>
- DELETE /localhost:port/deleteuser?email=<email>

Meetings Endpoints
- POST /localhost:port/createmeeting?email=<email>                
   * you can provide optional request body following the [Create a Meeting api request body](https://developers.zoom.us/docs/api/meetings/#tag/meetings/POST/users/{userId}/meetings)
- GET /localhost:port/getmeetings?email=<email>
- DELETE /localhost:port/deletemeeting?email=<email>&meetingId=<meetingId>

Utility functions
- GET /localhost:port/signature?meetingNumber=<meetingNumber>&role=<role>

[Postman Collection](https://github.com/user-attachments/files/19539485/ISV.Rivet.API.Flow.postman_collection.json.zip)

## Webhooks
The Server also listens for Zoom Events. You can subscribe to events on the Zoom Marketplace by going to the Server-to-Server you created, click the feature tab, select Event Subscriptions and select the events you want to subscribe to. In development, you will need to use ngrok or a similar service to open up your localhost for online communication with Zoom Web. For Rivet, you must append `/zoom/events` to the Endpoint URL like so:

<img width="755" alt="Image" src="https://github.com/user-attachments/assets/37d4ff2a-5c39-41da-a7a4-36eb0086f93c" />

