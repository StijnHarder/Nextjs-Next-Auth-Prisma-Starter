const bcrypt = require("bcrypt");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const allUsers = await prisma.user.findMany();

  if (allUsers.length === 0) {
    console.log("No users found. Seeding default admin user...");

    const hashedPassword = await bcrypt.hash("changeme123", 10);

    const newUser = await prisma.user.create({
      data: {
        username: "admin",
        hashed_password: hashedPassword,
        api_key_hash: "sampleapikeyhash",
        domain_url: "https://example.com",
        admin: true,
      },
    });

    console.log("✅ Seeded admin user:", newUser);
  } else {
    console.log("Existing users:", allUsers);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });