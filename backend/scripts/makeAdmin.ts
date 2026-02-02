import prisma from "../src/prisma";

async function makeAdmin() {
    const email = "sapna@sharma.com";

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            console.error(`No user found with email ${email}. Create one first or use upsert.`);
            process.exitCode = 1;
            return;
        }

        await prisma.user.update({ where: { email }, data: { role: "ADMIN" } });
        console.log("User promoted to ADMIN");
    } catch (err: any) {
        console.error("Error:", err?.message ?? err);
        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
    }
}

makeAdmin();