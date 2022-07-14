import fetch from "node-fetch";
import { db } from "./app";
import { MAX_RESP_TIME } from "./utils";

type SignedBlindedBlock = {
  message: {
    slot: string;
  };
};

export type submitBlindedBlockRequest = {
  signed_blinded_block: SignedBlindedBlock;
  relay_url: string;
};

export const handleBlindedBlock = async (
  body: submitBlindedBlockRequest
): Promise<string> => {
  // TODO: validate request is even valid by checking signature, parent hash, attestations, etc

  const insert = db.prepare(
    "INSERT INTO blindedBlocksResponses (slot, relay_url, timestamp_sent, blinded_block) VALUES (?, ?, ?, ?)"
  );
  const timestampSent = Date.now();
  insert.run(
    body.signed_blinded_block.message.slot,
    body.relay_url,
    timestampSent,
    JSON.stringify(body)
  );
  const endpoint = new URL("/eth/v1/builder/blinded_blocks", body.relay_url);

  let relayResponse;
  try {
    relayResponse = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(body.signed_blinded_block),
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    throw e;
  }
  // TODO: just timeout after a few secs if no response

  const timestampAfter = Date.now();
  const responseTime = timestampAfter - timestampSent;

  const relayBlockResponse = await relayResponse.json();
  const wasResponseValid = isResponseValid(relayBlockResponse);

  const update = db.prepare(
    "UPDATE blindedBlocksResponses SET response_time=(?), response_valid=(?) WHERE slot=(?) AND relay_url=(?)"
  );

  update.run(
    responseTime,
    wasResponseValid,
    body.signed_blinded_block.message.slot,
    body.relay_url
  );

  return relayBlockResponse;
};

export const handleGetRelayStats = () => {
  // find each relay's % of successful responses, ie: relay's response time was under a limit, and the response was deemed valid
  // TODO fix: if no valid responses, relay does not get a reputation bc COUNT.
  const query = db.prepare(
    "SELECT b.relay_url, COUNT(b.relay_url) *1.0 / (SELECT COUNT(b.relay_url) from blindedBlocksResponses b GROUP BY relay_url) AS blindBlockResponseRate \
    from blindedBlocksResponses b WHERE b.response_time<(?) AND b.response_valid = 1 GROUP BY relay_url;"
  );
  return query.all(MAX_RESP_TIME);
};

const isResponseValid = (_response: any): string => {
  // TODO: validate if block from relay is valid, do the hashes match?
  // For now, just mock with a random bool
  return Number(Math.floor(Math.random() * 2)).toString();
};
