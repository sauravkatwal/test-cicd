# Welcome to Sendy Backend

## Prerequisites

- node >= `16.x`
- npm >= `v1.22.x`
- Familiar with TypeScript 💪
- Familiar with docker 💪


## How to use

clone this repo with `https` / `ssh` / `github cli`

```sh
git clone https://github.com/varosa/express-graphql-templates.git
```

After cloning this repo, make sure you have duplicated the .env.example file to .env, don't let the .env.example file be deleted or renamed.

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm install

or

yarn install

or

yarn
```

## Build the project

To incrementally build the project:

```sh
npm run build

or

yarn build
```

## Start the project

To incrementally start the project:

```sh
npm run start

or

yarn start
```

## Run with Docker
Adjust the config in .env.docker like this:

```sh
# Application
ENVIRONMENT=development
PORT=8080
GRAPHIQL=true
```

container_name in each service is customizable.
image in each service is customizable.

PORT=... If you want to use a port other than 7000, you must also change the port in the services app

```sh
services:
  sendy-backend:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - '.env.docker:/usr/src/app/.env'
    container_name: container_name
    image: image
    restart: on-failure
    env_file:
      - .env.docker
    ports:
      - 8080:8080
```

DB_HOST=... must be accessed using IPv4 Docker Network services db.

```sh
services:
  postgres_db:
    image: postgres
    container_name: postgres
    restart: always
    command: postgres -c 'max_connections=100'
    ports:
      - 5432:5432
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - ./pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

After all the above configuration is adjusted, you can run it with the command:

Command aggregates the output of each container
```sh
docker-compose up
```
Detached mode: Run containers in the background,
```sh
docker-compose up -d
```
