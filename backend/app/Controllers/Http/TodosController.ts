import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import prisma from 'App/Services/Prisma'

export default class TodosController {
  public async index() {
    return prisma.todo.findMany({ orderBy: { createdAt: 'desc' } })
  }

  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate({
      schema: schema.create({
        title: schema.string({ trim: true }, [rules.maxLength(180)]),
      }),
    })

    const todo = await prisma.todo.create({ data: { title: payload.title } })
    return response.created(todo)
  }

  public async update({ params, request, response }: HttpContextContract) {
    const payload = await request.validate({
      schema: schema.create({
        title: schema.string({ trim: true }, [rules.maxLength(180)]),
        isCompleted: schema.boolean(),
      }),
    })

    const id = Number(params.id)
    if (!Number.isSafeInteger(id) || id < 1) return response.badRequest({ message: 'Invalid todo id' })

    const existing = await prisma.todo.findUnique({ where: { id } })
    if (!existing) return response.notFound({ message: 'Todo not found' })

    return prisma.todo.update({ where: { id }, data: payload })
  }

  public async destroy({ params, response }: HttpContextContract) {
    const id = Number(params.id)
    if (!Number.isSafeInteger(id) || id < 1) return response.badRequest({ message: 'Invalid todo id' })

    const deleted = await prisma.todo.deleteMany({ where: { id } })
    if (!deleted.count) return response.notFound({ message: 'Todo not found' })

    return response.noContent()
  }
}