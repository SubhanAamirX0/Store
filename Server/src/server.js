import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";

async function startServer() {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(`Mithri API running on port ${env.port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start Mithri API", error);
  process.exit(1);
});
