import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import crypto from "node:crypto";

const prisma = new PrismaClient();

const COUNT = parseInt(process.env.SEED_COUNT || "200", 10);
const PASSWORD = process.env.SEED_PASSWORD || "Password123!";
const ALLOW_PROD =
  process.argv.includes("--allow-prod-seed") ||
  process.env.ALLOW_PROD_SEED === "true";

if (process.env.NODE_ENV === "production" && !ALLOW_PROD) {
  console.error(
    "FATAL: Refusing to seed load test users in production environment without --allow-prod-seed flag."
  );
  process.exit(1);
}

// Compute one calibrated scrypt hash to share among seeded test users for lightning-fast seeding
async function computeHash(pwd) {
  const salt = crypto.randomBytes(16);
  return new Promise((resolve, reject) => {
    crypto.scrypt(
      pwd,
      salt,
      64,
      { N: 16384, r: 8, p: 1, maxmem: 32 * 1024 * 1024 },
      (err, key) => {
        if (err) return reject(err);
        resolve(
          `scrypt$16384$8$1$${salt.toString("hex")}$${key.toString("hex")}`
        );
      }
    );
  });
}

async function seedViaPsql(users) {
  const values = users.map(
    (u) =>
      `('${u.id}', '${u.email}', '${u.name}', '${u.passwordHash}', NOW(), NOW())`
  );
  const sql = `INSERT INTO users ("id", "email", "name", "passwordHash", "createdAt", "updatedAt") VALUES \n${values.join(
    ",\n"
  )}\nON CONFLICT ("email") DO NOTHING;\n`;

  try {
    execSync("docker exec -i uni-project-db-1 psql -U postgres -d uni_dev", {
      input: sql,
      stdio: ["pipe", "pipe", "inherit"],
    });
    console.log(
      `Successfully seeded ${users.length} users into Docker database via psql!`
    );
    return true;
  } catch (err) {
    console.error("Docker psql seed failed:", err.message);
    return false;
  }
}

async function main() {
  console.log(`\n--- Seeding ${COUNT} Examiner / Load Test Users ---`);
  console.log(
    `Default credentials: email="loaduser_<1..${COUNT}>@example.com", password="${PASSWORD}"`
  );

  const passwordHash = await computeHash(PASSWORD);

  const users = [];
  for (let i = 1; i <= COUNT; i++) {
    users.push({
      id: `load_user_${i}`,
      email: `loaduser_${i}@example.com`,
      name: `Load Test User ${i}`,
      passwordHash,
    });
  }

  // Attempt Prisma direct insert first (works when DB port is bound to host)
  try {
    let created = 0;
    for (let i = 0; i < users.length; i += 50) {
      const chunk = users.slice(i, i + 50);
      const result = await prisma.user.createMany({
        data: chunk,
        skipDuplicates: true,
      });
      created += result.count;
    }
    console.log(`Successfully seeded ${created} users via Prisma Client!`);
  } catch (prismaErr) {
    console.log(
      "Prisma direct connection unavailable on host port 5432. Falling back to Docker psql container injection..."
    );
    const ok = await seedViaPsql(users);
    if (!ok) {
      throw prismaErr;
    }
  }
}

main()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => {});
  });
