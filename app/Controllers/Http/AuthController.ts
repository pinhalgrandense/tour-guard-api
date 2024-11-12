import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'


export default class AuthController {
  public async login({ request, auth, response }: HttpContextContract) {
    const loginSchema = schema.create({
      email: schema.string({}, [
        rules.email(),
        rules.required()
      ]),
      password: schema.string({}, [
        rules.minLength(6),
        rules.required()
      ])
    })

    const payload = await request.validate({ schema: loginSchema })

    try {
      // Tenta autenticar o usuário
      console.log(auth)
      const token = await auth.use('api').attempt(payload.email, payload.password)
      return response.ok({ token })
    } catch (error) {
      console.error(error)
      return response.unauthorized('Invalid credentials')
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    if (auth.isAuthenticated) {
      await auth.use('api').revoke()
      return response.ok({})
    }
    return response.badRequest({ message: 'Você não está logado.' })
  }
}
