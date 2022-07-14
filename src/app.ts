import express from "express";
import logger from "morgan";
import { errorHandler } from "./errorHandler";
import { getDB, MAX_RESP_TIME } from "./utils";
import {
  handleBlindedBlock,
  handleGetRelayStats,
  submitBlindedBlockRequest,
} from "./routes";

export const app = express();
export const db = getDB();
app.use(logger("dev"));
app.use(express.json());
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/relay_monitor/config", (req, res) => {
  res.send({ max_response_time_ms: MAX_RESP_TIME });
});

app.post("/relay_monitor/blinded_blocks", async (req, res) => {
  const relayResponse = await handleBlindedBlock(
    req.body as submitBlindedBlockRequest
  );
  res.send(relayResponse);
});

app.get("/relay_monitor/get_relay_stats", async (req, res) => {
  const rep = handleGetRelayStats();
  res.send(rep);
});
