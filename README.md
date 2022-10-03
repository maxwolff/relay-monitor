# Relay Monitor PoC

### [Spec](https://hackmd.io/@GUEKFRb9TryQv9zr8Zjx8Q/SJ-d0g9i5)

A service that keeps stats on the behavior of builder-relays, and exposes an endpoint that mev-boost could use to check on performance.

`npm install`
`npm run build`
`npm test`

init a dev db

- `npm run migrate`

start the relay monitor

- `npm run serve-watch`

start the mock-relay server (randomly sends good or bad responses)

- `npm run mock-relay`

start sending mock requests to the relay monitor. these are forwarded to the mock-relay, which returns a good or bad response randomly.

- `npm run mock-requests`

observe relay stats of our mock-relay

- `curl http://localhost:3000/relay_monitor/get_relay_stats`

# docker

`npm install`
`npm run build`
`docker build . -t monitor`
`docker run -it -p 127.0.0.1:3000:3000 monitor`
