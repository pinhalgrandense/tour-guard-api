// app/Controllers/Http/ManagerProfileController.ts
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Manager from "App/Models/Manager";
import User from "App/Models/User";

export default class ManagerProfileController {
  // Busca as informações do manager autenticado
  public async show({ auth, response }: HttpContextContract) {
    try {
      const userId = auth.user?.id;

      // Carrega o manager e as informações do usuário associado
      const manager = await Manager.query()
        .where("user_id", userId!)
        .preload("user")
        .firstOrFail();

      return response.ok(manager);
    } catch (error) {
      return response.status(404).json({ message: "Manager não encontrado" });
    }
  }

  // Atualiza as informações do manager autenticado
  public async update({ auth, request, response }: HttpContextContract) {
    try {
      const userId = auth.user?.id;

      // Busca o manager baseado no ID do usuário autenticado
      const manager = await Manager.query()
        .where("user_id", userId!)
        .firstOrFail();

      // Busca o usuário associado ao manager
      const user = await User.findOrFail(manager.user_id);

      // Atualiza os dados do usuário
      const data = request.only(["full_name", "email", "password"]);
      user.merge(data);
      await user.save();

      return response.ok({
        message: "Informações atualizadas com sucesso",
        manager,
      });
    } catch (error) {
      return response
        .status(400)
        .json({ message: "Erro ao atualizar as informações", error });
    }
  }
}
