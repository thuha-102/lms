## Installation
```bash
$ npm install
$ npm install --global yarn
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

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Run prisma
```bash
$ npm install typescript ts-node @types/node --save-dev
$ npm install prisma --save-dev
$ npm install @prisma/client

# $ yarn prisma:generate

//for every change schema.prisma to update database
$ yarn prisma db push 

```

