import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Mine from "App/Models/Mine";

export default class MinesController {
  public async index({ auth, response }: HttpContextContract) {
    try {
      const manager = auth.user;
      if (!manager) {
        return response.unauthorized({ message: "Não autorizado." });
      }

      const mines = await Mine.query().where("admin_id", manager.id);

      return response.ok({ mines });
    } catch (error) {
      console.error(error);
      return response.internalServerError({
        message: "Erro ao buscar as minas.",
      });
    }
  }

  public async update({
    params,
    request,
    auth,
    response,
  }: HttpContextContract) {
    try {
      const manager = auth.user;
      if (!manager) {
        return response.unauthorized({ message: "Não autorizado." });
      }

      const mine = await Mine.query()
        .where("id", params.id)
        .andWhere("admin_id", manager.id)
        .first();

      if (!mine) {
        return response.notFound({
          message: "Mina não encontrada ou não pertence a você.",
        });
      }

      const data = request.only([
        "name",
        "description",
        "qr_code",
        "instagram",
        "facebook",
      ]);

      mine.merge(data);
      await mine.save();

      return response.ok({ message: "Mina atualizada com sucesso.", mine });
    } catch (error) {
      console.error(error);
      return response.internalServerError({
        message: "Erro ao atualizar a mina.",
      });
    }
  }
}
