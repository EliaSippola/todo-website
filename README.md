# Todo website

Todo website created in one day as a school project

Frontend is coded in React, and backend in Express and NodeJS. Backend contains api, that frontend connects to. Api provides todos from MongoDB database.

## usage

Create and delete todos

![image of the website](https://github.com/EliaSippola/todo-website/assets/120164112/ab85e88b-e5eb-4708-8c23-6b245aea82f6)

*image of the website*

## Installation

1. Install NPM packeges.

2. Setup `.env` files

### backend

location: `./server/.env`

```ini
# port for backend server (api included)
PORT = 3030

# mongodb connection str
# backend will use collection "todos" on the target database
MONGODB_URL = <link>

# api key for api, must match with frontend
LOCAL_API_KEY = 1234567890
```

### frontend

location: `./client/.env`

```ini
# api key to use when connecting to backend api
# must match with backend api key
REACT_APP_LOCAL_API_KEY = 1234567890

# api url, match with backend location
# backend will open api at '/todos' on default
REACT_APP_API_URL = http://localhost:3030/todos
```

3. Run backend and frontend
