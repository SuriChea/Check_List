import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Cors {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const origin = request.header('origin')

    if (origin === 'http://localhost:5173') {
      response.header('Access-Control-Allow-Origin', origin)
      response.header('Vary', 'Origin')
      response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.header('Access-Control-Allow-Headers', 'Content-Type')
    }

    if (request.method() === 'OPTIONS') {
      response.status(204)
      return
    }

    await next()
  }
}