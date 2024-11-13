import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AdminController {
  // Método para o admin ver suas próprias informações
  public async index({ auth, request, response }: HttpContextContract) {
    console.log("headers", request.headers())
    try {
      const user = await User.findOrFail(auth.user?.id)  // Pega o ID do usuário autenticado
      return response.ok(user)
    } catch (error) {
      return response.status(404).json({ message: 'Usuário não encontrado' })
    }
  }

  // Método para o admin atualizar suas próprias informações
  public async update({ auth, request, response }: HttpContextContract) {
    try {
      const user = await User.findOrFail(auth.user?.id)
      const data = request.only(['full_name', 'email', 'password']) // Campos permitidos para atualizar

      if (data.password) {
        user.password = data.password // Hash automático no beforeSave do model
      }

      user.merge(data) // Atualiza os campos no model
      await user.save() // Salva as mudanças no banco

      return response.ok({ message: 'Dados atualizados com sucesso', user })
    } catch (error) {
      return response.status(400).json({ message: 'Erro ao atualizar dados', error })
    }
  }
}