const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Tạo mới 1 user
  await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@gmail.com",
      password: '123'
    },
  });

  // Lấy tất cả user
  const users = await prisma.user.findMany();
  console.log("Users trong DB:", users);
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
