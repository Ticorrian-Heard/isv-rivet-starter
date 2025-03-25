The [Zoom Rivet SDK](https://developers.zoom.us/docs/rivet/javascript/) is a framework that accelerates server-side app development for Zoom's developer products. 
Compatible with JavaScript and TypeScript, this comprehensive tool enables developers to create integrations more quickly and spend more time on core business logic.

This Sample App showcases the power of Rivet by offering a one-click, quick start Express backend server. This server includes each Rivet module except the chatbot module ([Sample App for Rivet Chatbot here](https://github.com/zoom/rivet-javascript-sample))

Use of Zoom Rivet SDK is subject to our [Terms of Use](https://www.zoom.com/en/trust/terms/).

## Installation

Clone this repo into your local enviroment:
```
$ git clone https://github.com/Ticorrian-Heard/zoom-rivet-server.git
```

Once cloned, cd into the directory and install the npm packages: 
```
$ npm install
```

## Usage
In the project, there is a bash script `run.sh` that is used to run the modules. The commands and options are as follows
```bash
./run.sh [options]
 -o, --oauth  (required) [UserOAuth, S2SOAuth]
 
 -m, --module (required) [users, meetings, accounts, teamchat(S2SOAuth only), phone, videosdk_api(S2SOAuth only)]
 
 -p, --port              [1024-65535]
 
 -c, --color             [black, red, green, yellow, blue,
                          magenta, cyan, white, gray,
                          any hex values for colors (e.g. #23de43) or auto for
                          an automatically picked color]
```

If you are thrown a permissions error when running the bash script. You can use `chmod` to adjust like so:
```
$ chmod 700 run.sh
```

Once the server is running, it will listen on the specified port and you can now make REST API to the corresponding module endpoints. 
For some endpoints, you will need to provide request body, params, query according to the [Rivet SDK Reference Docs](https://zoom.github.io/rivet-javascript/modules.html). For the request body, you can reference the [Zoom API Endpoint](https://developers.zoom.us/docs/api/) that Rivet calls to. 

For example, assuming you run the S2SOAuth meetings module like so: `./run.sh -o S2SOAuth -m meetings -p 8888 -c blue`

here is an API call to the Rivet Sample app that makes an update to a meeting. 

```
curl --location --request PATCH 'http://localhost:8888/updatemeeting' \
--header 'Content-Type: application/json' \
--data '{                        <---- reference Rivet SDK docs for path, query, and body requirements
    "path": {
        "meetingId": "0000000000"
    },
    "query": {
        "occurrence_id": "111111111"
    },
    "body": {                    <--- reference Zoom REST API docs for correct Request Body
        "agenda": "My Meeting", 
        "duration": 60,
        "password": "newPassword",
        "start_time": "2025-03-27T07:29:29Z",
        "template_id": "5Cj3ceXoStO6TGOVvIOVPA==",
        "timezone": "America/Los_Angeles",
        "topic": "My Meeting",
        "type": 2
    }
}'
```
