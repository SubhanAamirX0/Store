import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import debugRoutes from "./routes/debug.routes.js";
import discountRoutes from "./routes/discount.routes.js";
import orderRoutes from "./routes/order.routes.js";
import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDistPath = path.resolve(__dirname, "../../Client/dist");
const clientIndexPath = path.join(clientDistPath, "index.html");
const shouldRedirectToClient = env.nodeEnv === "production" && Boolean(env.clientUrl);

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "mithri-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/debug", debugRoutes);

if (env.nodeEnv === "production") {
  app.use(express.static(clientDistPath));

  app.get(/^\/(?!api).*/, (req, res, next) => {
    if (shouldRedirectToClient) {
      const targetUrl = new URL(req.originalUrl, env.clientUrl);
      res.redirect(302, targetUrl.toString());
      return;
    }

    res.sendFile(clientIndexPath, (error) => {
      if (error) next(error);
    });
  });
}

app.get("/", (req, res) => {
  if (shouldRedirectToClient) {
    res.redirect(302, env.clientUrl);
    return;
  }

  res.json({
    message: "Mithri API is running",
    status: "healthy"
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;
