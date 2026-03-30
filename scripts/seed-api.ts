import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const api = await prisma.api.upsert({
    where: { id: 1 },
    update: {
      baseurl: 'https://api.koboillm.com/v1',
      key_api: 'sk-kO4S8mUMrB4bVV1ZeAkpJA'
    },
    create: {
      id: 1,
      baseurl: 'https://api.koboillm.com/v1',
      key_api: 'sk-kO4S8mUMrB4bVV1ZeAkpJA'
    }
  })
  console.log('API config saved:', api)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
