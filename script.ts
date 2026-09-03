import "dotenv/config";
import { db } from "./prisma/db";

async function main() {
  const runtime = await db.connect({ url: process.env.DATABASE_URL! });

  const users = await db.orm.public.Users
    .select("userId", "username" ,"password" )
    .all();

  console.log(users);

  await runtime.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});