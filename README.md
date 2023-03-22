<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


## Description

This is an implementation of a micro-service responsible for handling tasks, by managers and technicians.
Ideally there would be an API making request to sign up and log in users, and a micro-service responsible for that. Since there was no time to implement all of that, and it was not the scope of this project, we have a module responsible for authentication, with some pre-defined users. In this module we login uses and get a jwt for them.

The Tasks module is responsible for all the manipulation of tasks (create, read, update and delete), in the tasks controller we have guards to ensure that only authorized users have access to them, and in the service we connect to a mysql database.

In the tasks module we implemented RabbitMQ to publish and consume events, so any time a new task is created, an event will be published. When we consume this event a Notifications Service will be called to dispatch the notification.

The docker compose file contains all of the app dependencies (mysql and rabbitmq)

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev
```

## Test

```bash
# unit tests
$ yarn test

# test coverage
$ yarn test:cov
```
