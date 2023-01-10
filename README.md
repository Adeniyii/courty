# Backend for a Meal provider service

An experimental backend service written in NestJS, complete with custom-rolled authentication, RBAC authorization, caching, and database storage.

## Hosting

Live at [courty.fly.dev](https://courty.fly.dev).

## QuickStart

The database has been seeded with an admin user, the details are:

```
email: slimreaper@gmail.com
password: slimreaper

```

Use this account to access the api. Alternatvely, to explore your powerlessness, create an account using the `sign-up` endpoint. This account will not have admin priveledges.

No brands, or brand addons have been seeded, so have fun creating some with the admin account.

**Note**: Make sure to attach the auth-token recieved from the `sign-up` or `refresh-tokens` endpoint as a bearer token to protected api endpoints.

## Features

- **Docker support**
- **Deployment**: Dockerfile is deployed on the [fly.io](https://fly.io) cloud platform
- **Backend**: API written using [NestJS](https://nestjs.com)
- **SQL database**: PostgreSQL provided by [Railway](https://www.railway.app)
- **ORM and Migrations**: Object Relational Mapping using [Objection](https://vincit.github.io/objection.js/), and migrations using [Knex](https://knex.com)
- **Caching**: Lightweight caching of refresh-tokens using **Redis** provided by [Upstash](https://upstash.com/)
- **Authentication and authorization**: Custom rolled JWT strategy, with a rotating refresh token system
- **Validation**: request data validation using [class-validator](https://github.com/typestack/class-validator)
- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

Docker:

```bash
# run docker container in development mode
$ docker build -t courty .
$ docker-compose up -d
```

Linting:

```bash
# run ESLint
$ npm run lint
```

Migration:

```bash
$ npm run migrate
```

Seeding:

```bash
$ npm run seed
```

## Environment Variables

The environment variables can be found and modified in the `.env.example` file.

```bash
PORT=8080

# db
DATABASE_URL=
REDIS_URL=

# jwt
JWT_SECRET=
JWT_TOKEN_ISSUER=
JWT_ACCESS_TOKEN_TTL=
JWT_REFRESH_TOKEN_TTL=

```

### API Endpoints

List of available routes:

**Auth routes**:\
`POST /authentication/sign-up` - sign up\
`POST /authentication/sign-in` - sign in\
`POST /authentication/refresh-tokens` - refresh auth tokens

**Brand routes**:\
`POST /brands` - create a brand\
`GET /brands` - get all brands\
`POST /brands/:brandId/addons` - create a meal addon for the specified brand\
`GET /brands/:brandId/addons` - get all meal addons for the specified brand\
`GET /brands/:brandId/addons/:addonId` - get a single meal addon for the specified brand\
`PATCH /brands/:brandId/addons/:addonId` - update a single meal addon for the specified brand\
`DELETE /brands/:brandId/addons/:addonId` - delete a single meal addon for the specified brand\
`POST /brands/:brandId/addon-categories` - create a meal addon-category for the specified brand
