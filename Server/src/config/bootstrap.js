import User from "../models/user.model.js";
import { env } from "./env.js";

export async function bootstrapAdminAccount() {
  if (!env.bootstrapAdminEnabled) return null;

  const existingAdmin = await User.findOne({ email: env.bootstrapAdminEmail }).select("_id");
  if (existingAdmin) return existingAdmin;

  const admin = await User.create({
    name: env.bootstrapAdminName,
    email: env.bootstrapAdminEmail,
    password: env.bootstrapAdminPassword,
    role: "admin",
    isActive: true
  });

  console.log(`Bootstrapped admin account: ${env.bootstrapAdminEmail}`);
  return admin;
}
