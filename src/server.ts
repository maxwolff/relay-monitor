import { app } from "./app";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`The application is listening on port ${PORT}!`);
  // check did migrate
  // check env
});

export default server;
