<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Title
<h3>Bus Ticketing System</h3>

## Description
[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
<p>This project is a ticket booking system. There has 4 types of module/users such as Admin, Manager, Agent and Customer. Where customers can book tickets for bus. Admin, 
manager and agent manage the system</p>

## Feature Analysis
  <ol>
    <li>User Category</li>
    <ul>
      <li>Admin</li>
      <li>Manager</li>
      <li>Agent</li>
      <li>Customer</li>
    </ul>
    <li>Feature List</li> 
     <b><p>Customer</p></b>
      <ul>
        <li>CreateInfo</li>
        <li> Register customer</li>
        <li>get customer by id</li>
        <li>Update Customer Info</li>
        <li>Feedback and Ratings</li>
        <li>Ticket view</li>
        <li>Booked Ticket</li>
        <li>Ticket History</li>
        <li>Cancel Ticket</li>
        <li>Ticket tracking / specific booked ticket</li>
        <li>Check Notification</li>
        <li>Report Customer</li>
        <li>Login</li>
        <li>Logout</li>
      </ul>
     <b><p>Manager</p></b>
      <ul>
        <li>create agent</li>
        <li>update agent name</li>
        <li>login users</li>
        <li>get all customers</li>
        <li>update customer</li>
        <li>delete customer</li>
        <li>delete agent</li>
        <li>Create bus</li>
        <li>update bus number</li>
        <li>View all buses</li>
        <li>update manager info</li>
        <li>update password</li>
        <li>view all agent</li>
        <li>view all tickets</li>
      </ul>
      <b><p>Agent</p></b>
      <ul>
        <li>create ticket</li>
        <li>update ticket</li>
        <li>delete ticket</li>
        <li>monitor customers</li>
        <li>monitor ticket book infor</li>
        <li>bus update</li>
        <li>bus delete</li>
        <li>bus create</li>
        <li>notification create</li>
        <li> notification update</li>
        <li>notification delete</li>
        <li>agent profile update</li>
      </ul>
    
  </ol>

## Backend Development Tools:
- NestJs
- NodeJs
- TypeScript
- TypeORM
# Database:
- PostgreSQL
- pgAdmin
# API Tools
- Postman
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

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
