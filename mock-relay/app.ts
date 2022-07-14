import express from "express";
import logger from "morgan";
import { errorHandler } from "../src/errorHandler";

export const app = express();

app.use(errorHandler);
app.use(express.json());
app.use(logger("dev"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

type Block = {
  data: {
    transactions: string[];
  };
};

app.all("/eth/v1/builder/blinded_blocks", async (req, res) => {
  const response = await handleRelayResponse(3000);
  res.send(response);
});

export const handleRelayResponse = async (timeSeed: number): Promise<Block> => {
  await sleep(Math.random() * timeSeed);
  return { data: { transactions: [] } };
};

async function sleep(timeout: number): Promise<void> {
  return new Promise((resolve, _reject) => {
    setTimeout(() => resolve(), timeout);
  });
}
