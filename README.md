# App2-Mini-Poll
An app where users create a single-question poll with a few answers. Polls can be edited and shared, allowing others to vote and see results

## Feature Map:
Trello: https://trello.com/invite/b/696ceb9588988a1c0ca638cd/ATTI06f867afcf0988c556e1ff5af4f5a58d4DAAA853/app-2-prosjekt

## Techincal requirements (planned)
- Client: PWA
- Server: Express
- Database: PostgreSQL
- REST-ish API
- Offline support

## Project Management
This project is managed using Trello to plan features and track progress: https://trello.com/invite/b/69762ab68f0e570061495c8e/ATTI81ff6ddb18072fbecb9fdffe2577bea79A90973A/app2

## API

### Polls
GET /polls returns a list of all polls. Response: 200 OK
POST /polls creates a new poll. Response: 201 Created
GET /polls/:pollId returns a poll by ID. Response: 200 OK
PUT /polls/:pollId updates a poll. Response: 200 OK
DELETE /polls/:pollId deletes a poll. Response: 200 OK

### Votes
POST /polls/:pollId/votes submits a vote for a poll. Response: 201 Created
GET /polls/:pollId/results returns poll results. Response: 200 OK

### Testing
The API is tested using postman. The exported test collection is included in the repository.

## User data & GDPR consideration

This application collects the following data:
- Username (used as a unique identifier for the user)
- Password hash (used for authentication)
- Consent information ( TOS & Privacy acceptance, timestamp and version)

The collected data is only used to:
- Create and manage user accounts
- Authenticate users
- Record user consent