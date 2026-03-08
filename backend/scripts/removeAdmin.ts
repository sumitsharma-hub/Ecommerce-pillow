import dotenv from "dotenv";
import path from "path";
import readline from "readline";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

import prisma from "../src/prisma";

function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function removeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error("❌ Please provide an email.");
    console.log("Usage: npm run remove-admin user@email.com");
    process.exit(1);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ No user found with email ${email}`);
      process.exit(1);
    }

    console.log(`User found: ${user.email}`);
    console.log(`Current role: ${user.role}`);

    const answer = await askQuestion(
      `Are you sure you want to downgrade ${email} to USER? (y/n): `
    );

    if (answer.toLowerCase() !== "y") {
      console.log("❌ Operation cancelled.");
      process.exit(0);
    }

    await prisma.user.update({
      where: { email },
      data: { role: "USER" },
    });

    console.log(`✅ ${email} downgraded to USER`);
  } catch (err: any) {
    console.error("Error:", err?.message ?? err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

removeAdmin();