import dotenv from "dotenv";

dotenv.config();

function parseAllowedOrigins(value) {
  return value
    ? value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : ["http://localhost:5173"];
}

function buildOriginMatcher(value) {
  const origins = parseAllowedOrigins(value);

  return function isAllowedOrigin(origin) {
    if (!origin) return true;
    if (origins.includes(origin)) return true;
    if (origin.startsWith("http://localhost:") || origin.startsWith("https://localhost:")) return true;
    if (origin.endsWith(".vercel.app")) return true;
    if (origin.endsWith(".onrender.com")) return true;
    return false;
  };
}

export const env = {
  port: Number(process.env.PORT ?? 5000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  allowedOrigins: parseAllowedOrigins(process.env.CLIENT_URL),
  isAllowedOrigin: buildOriginMatcher(process.env.CLIENT_URL),
  mongoUri: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/mithri",
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d"
};
