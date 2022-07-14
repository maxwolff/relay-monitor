import http from "http";
import { handleBlindedBlock } from "../routes";
import { app as monitor_app, db } from "../app";
import { app as relay_app } from "../../mock-relay/app";
import { getDummyRequests } from "../utils";

import fetch from "node-fetch";
import { migrate } from "../../script/migrate";

describe("save blinded block etc", () => {
  let relay_server: http.Server;
  let monitor_server: http.Server;
  const MONITOR_PORT = 101;
  const RELAY_PORT = 102;

  beforeAll(async () => {
    await migrate("up", "001", db);

    monitor_server = monitor_app.listen(MONITOR_PORT);
    relay_server = relay_app.listen(RELAY_PORT);
  });

  it("relay monitor and mock relay should be online", async () => {
    const resp = await fetch(`http://localhost:${MONITOR_PORT}`);
    expect(resp.status).toBe(200);
    const resp2 = await fetch(
      `http://localhost:${RELAY_PORT}/eth/v1/builder/blinded_blocks`
    );
    expect(resp2.status).toBe(200);
  });

  // we send the relay monitor some blinded blocks, it saves in the db, and it also forwards along to the relay
  // we dont assert anything here yet, just using for dev
  // reputation will be random bc mock relay randomly gives bad responses
  it("submit blocks to relay", async () => {
    const relayRequests = [
      ...getDummyRequests(6, 6, `http://localhost:${RELAY_PORT}`),
    ];
    await Promise.all(relayRequests.map(handleBlindedBlock));
    const info = db.prepare("SELECT * FROM blindedBlocksResponses").all();
    console.log(`info ${JSON.stringify(info)}`);
    const resp = await fetch(
      `http://localhost:${MONITOR_PORT}/relay_monitor/get_relay_stats`
    );
    expect(resp.status).toBe(200);
  });

  afterAll(async () => {
    relay_server.close();
    monitor_server.close();
  });
});
