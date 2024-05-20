### A Nodejs (Express) application for tasks management running on Docker container

## This project contains a nodejs tasks API 
- You can create task (POST) /tasks/ --param {"name":"task1","description":"task decription"} --header {"x-auth-token":"token"}
- You can update task (PUT) /tasks/:id  --param{"name":"task1","description":"task decription"} --header {"x-auth-token":"token"}
- You can fetch task (GET) /tasks/:id
- You can fetch tasks (GET) /tasks/
- You an delete tasks (DELETE) /tasks/:id

## Users can also register and generate a JWT auth token
- User register - (POST) - '/users/' --param {"name":"Josh","email":"amd@mai.com","password":"password"}
- use login - (POST) - '/users/login' --param {"email:"email@mail.com","password":"password"}


## Install Docker on your machine
# Run docker compose up -d

