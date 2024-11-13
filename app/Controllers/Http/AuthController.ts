import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import UserHelper from 'App/Helpers/UserHelper'
import User from 'App/Models/User'


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

    const user = await User.findBy('email', payload.email)
    console.log('user', user)
    if (!user)
      return response.unauthorized({ message: 'Usuário não encontrado.' })

    const roles: string[] = await UserHelper.getRoles(user)
    if (roles.length === 0)
      return response.unauthorized({ message: 'Sua conta não tem permissões para logar.' })

    console.log('roles', roles)

    const role_table_name = {
      admin: 'admins',
      manager: 'managers',
    }

    const userRole = await Database.from(role_table_name[roles[0]])
      .where('user_id', user.id)
      .first()

    if (!userRole)
      return response.unauthorized({ message: 'Sua conta está invalidada. Contate o suporte.' })

    try {
      // Tenta autenticar o usuário
      console.log(auth)
      const token = await auth.attempt(payload.email, payload.password)
      return response.ok({ token, roles })
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
