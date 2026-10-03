import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Todo from 'App/Models/Todo'

export default class TodosController {
  public async index() {
    return Todo.query().orderBy('created_at', 'desc')
  }

  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate({
      schema: schema.create({
        title: schema.string({ trim: true }, [rules.maxLength(180)]),
      }),
    })

    const todo = await Todo.create({ title: payload.title, isCompleted: false })
    return response.created(todo)
  }

  public async update({ params, request }: HttpContextContract) {
    const payload = await request.validate({
      schema: schema.create({
        title: schema.string({ trim: true }, [rules.maxLength(180)]),
        isCompleted: schema.boolean(),
      }),
    })

    const todo = await Todo.findOrFail(params.id)
    todo.merge(payload)
    await todo.save()
    return todo
  }

  public async destroy({ params, response }: HttpContextContract) {
    const todo = await Todo.findOrFail(params.id)
    await todo.delete()
    return response.noContent()
  }
}