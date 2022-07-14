import { submitBlindedBlockRequest } from "../src/routes";
import { getDummyRequests } from "../src/utils";
import fetch from "node-fetch";
import { port } from "./server";

(async () => {
  // mock requests from a validator to the the local mock relay
  const reqs: submitBlindedBlockRequest[] = [
    ...getDummyRequests(30, 4, `http://localhost:${port}`), //
  ];
  console.log(
    `MOCKED RELAY MONITOR REQUESTS: ${reqs.map((e) => JSON.stringify(e))}`
  );
  await Promise.all(
    reqs.map((req) =>
      fetch("http://localhost:3000/relay_monitor/blinded_blocks", {
        method: "POST",
        body: JSON.stringify(req),
        headers: { "Content-Type": "application/json" },
      })
    )
  );
})();
