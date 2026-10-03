import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Todo from 'App/Models/Todo'

export default class MainSeeder extends BaseSeeder {
  public async run() {
    await Todo.updateOrCreateMany('title', [
      { title: 'วางแผนงานสำคัญประจำสัปดาห์', isCompleted: true },
      { title: 'เตรียมเอกสารสำหรับประชุมทีม', isCompleted: false },
      { title: 'ตอบอีเมลที่ค้างไว้', isCompleted: false },
      { title: 'จัดโต๊ะทำงานให้เรียบร้อย', isCompleted: true },
      { title: 'ทบทวนรายการงานก่อนเลิกงาน', isCompleted: false },
    ])
  }
}