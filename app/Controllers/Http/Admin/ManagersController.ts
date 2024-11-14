// app/Controllers/Http/ManagersController.ts
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Manager from 'App/Models/Manager'
import User from 'App/Models/User'

export default class ManagersController {
  // Lista todos os managers
  public async index({ response }: HttpContextContract) {
    const managers = await Manager.query().preload('user')
    return response.ok(managers)
  }

  // Mostra um manager específico
  public async show({ params, response }: HttpContextContract) {
    try {
      const manager = await Manager.query().where('user_id', params.id).preload('user').firstOrFail()
      return response.ok(manager)
    } catch (error) {
      return response.status(404).json({ message: 'Manager não encontrado' })
    }
  }

  // Cria um novo manager
  public async store({ request, response }: HttpContextContract) {
    const { full_name, email, password } = request.only(['full_name', 'email', 'password'])

    // Verifica se o user já existe antes de criar
    const user = await User.create({ full_name, email, password })
    const manager = await Manager.create({ user_id: user.id })

    return response.status(201).json({ message: 'Manager criado com sucesso', manager })
  }

  // Atualiza um manager específico (atualiza o user associado)
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const manager = await Manager.findOrFail(params.id)
      const user = await User.findOrFail(manager.user_id)

      const data = request.only(['full_name', 'email', 'password'])

      user.merge(data)
      await user.save()

      return response.ok({ message: 'Manager atualizado com sucesso', manager })
    } catch (error) {
      return response.status(400).json({ message: 'Erro ao atualizar manager', error })
    }
  }

  // Deleta um manager específico
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const manager = await Manager.findOrFail(params.id)
      await manager.delete()

      return response.ok({ message: 'Manager deletado com sucesso' })
    } catch (error) {
      return response.status(400).json({ message: 'Erro ao deletar manager', error })
    }
  }
}
