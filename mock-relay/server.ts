import { app } from "./app";

export const port = 3001;
app.listen(port, () => {
  console.log(`Mock relaylistening on port ${port}`);
});
