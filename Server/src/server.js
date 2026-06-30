import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";

async function startServer() {
  await connectDatabase();

 app.listen(process.env.PORT || 5000, () => {
  console.log(`Mithri API running`);
});
}

startServer().catch((error) => {
  console.error("Failed to start Mithri API", error);
  process.exit(1);
});
