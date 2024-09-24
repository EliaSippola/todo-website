# Launhing server and client on render

Launhing client and server on render (https://render.com/).

This launch is splitted to client and server (you can do both on same server with build stuff, and linking the backend and frontend, but I have not linked them in this project)

## backend

1. Set source code to you github repository (or this repo)

2. Set name to `todo-website-server` (or whatever you want, needs to be different from client)

3. Set root directory to `server`

4. Set build command to `npm install`

5. Set start command to `node app.js`

6. Choose instance type. (use free if you don't need much performance)

7. Set enviroment variables:

set one line at a time

```ini
PORT = 3030

MONGODB_URL = <link>

LOCAL_API_KEY = 1234567890
```

check `README.md` for info on what the variables do.

8. Deploy. Wait for server to deploy fully.

## frontend

1. Set source code to you github repository (or this repo)

2. Set name to `todo-website-client` (or whatever you want, needs to be different from server)

3. Set root directory to `client`

4. Set build command to `npm install && npm run build`

5. Set publis directory to `./build`

7. Set enviroment variables:

set one line at a time

```ini
REACT_APP_LOCAL_API_KEY = 1234567890

# set server url to your render server url
REACT_APP_API_URL = <server-url>/todos
```

check `README.md` for nore info on what the variables do.

8. Deploy. Wait for server to deploy fully.

9. If you setupped backend server correctly, you should be able to access the site from client server's address.