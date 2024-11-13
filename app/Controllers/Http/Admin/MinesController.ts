import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mine from 'App/Models/Mine'

export default class MinesController {
  // Listar todas as minas
  public async index({ response }: HttpContextContract) {
    const mines = await Mine.all()
    return response.ok(mines)
  }

  // Criar uma nova mina
  public async store({ request, response }: HttpContextContract) {
    const data = request.only(['admin_id', 'type', 'name', 'location', 'description', 'qr_code', 'instagram', 'facebook'])

    const mine = await Mine.create(data)
    return response.created(mine)
  }

  // Mostrar detalhes de uma mina específica
  public async show({ params, response }: HttpContextContract) {
    const mine = await Mine.find(params.id)
    if (!mine) {
      return response.notFound({ message: 'Mina não encontrada' })
    }
    return response.ok(mine)
  }

  // Atualizar uma mina existente
  public async update({ params, request, response }: HttpContextContract) {
    const mine = await Mine.find(params.id)
    if (!mine) {
      return response.notFound({ message: 'Mina não encontrada' })
    }

    const data = request.only(['admin_id', 'type', 'name', 'location', 'description', 'qr_code', 'instagram', 'facebook'])
    mine.merge(data)
    await mine.save()
    return response.ok(mine)
  }

  // Deletar uma mina
  public async destroy({ params, response }: HttpContextContract) {
    const mine = await Mine.find(params.id)
    if (!mine) {
      return response.notFound({ message: 'Mina não encontrada' })
    }
    await mine.delete()
    return response.noContent()
  }
}
