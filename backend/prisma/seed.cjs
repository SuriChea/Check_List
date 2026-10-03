const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const sampleTodos = [
  { title: 'วางแผนงานสำคัญประจำสัปดาห์', isCompleted: true },
  { title: 'เตรียมเอกสารสำหรับประชุมทีม', isCompleted: false },
  { title: 'ตอบอีเมลที่ค้างไว้', isCompleted: false },
  { title: 'จัดโต๊ะทำงานให้เรียบร้อย', isCompleted: true },
  { title: 'ทบทวนรายการงานก่อนเลิกงาน', isCompleted: false },
]

async function main() {
  for (const todo of sampleTodos) {
    const existing = await prisma.todo.findFirst({ where: { title: todo.title } })
    if (existing) {
      await prisma.todo.update({ where: { id: existing.id }, data: todo })
    } else {
      await prisma.todo.create({ data: todo })
    }
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => prisma.$disconnect())