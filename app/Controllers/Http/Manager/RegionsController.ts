import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Mine from "App/Models/Mine";
import Region from "App/Models/Region";
import { schema } from "@ioc:Adonis/Core/Validator";

export default class RegionsController {
  /**
   * Lista todas as regiões associadas a uma mina gerenciada pelo gestor logado.
   */
  public async index({ auth, params, response }: HttpContextContract) {
    try {
      const manager = auth.user;
      if (!manager) {
        return response.unauthorized({ message: "Não autorizado." });
      }

      // Verificar se a mina pertence ao gestor
      const mine = await Mine.query()
        .where("id", params.mine_id)
        .andWhere("admin_id", manager.id)
        .first();

      if (!mine) {
        return response.notFound({
          message: "Mina não encontrada ou não pertence a você.",
        });
      }

      // Listar as regiões da mina
      const regions = await Region.query().where("mine_id", mine.id);
      return response.ok({ regions });
    } catch (error) {
      console.error(error);
      return response.internalServerError({
        message: "Erro ao listar as regiões.",
      });
    }
  }

  public async show({ auth, params, response }: HttpContextContract) {
    try {
      const manager = auth.user;
      if (!manager) {
        return response.unauthorized({ message: "Não autorizado." });
      }

      // Verificar se a região pertence a uma mina gerenciada pelo gestor
      const region = await Region.query()
        .where("id", params.id)
        .andWhereHas("mine", (query) => {
          query.where("admin_id", manager.id);
        })
        .first();

      if (!region) {
        return response.notFound({
          message: "Região não encontrada ou não pertence a uma mina sua.",
        });
      }

      return response.ok({ region });
    } catch (error) {
      console.error(error);
      return response.internalServerError({
        message: "Erro ao listar a região.",
      });
    }
  }

  /**
   * Cria uma nova região associada a uma mina.
   */
  public async store({ auth, params, request, response }: HttpContextContract) {
    try {
      const manager = auth.user;
      if (!manager) {
        return response.unauthorized({ message: "Não autorizado." });
      }

      console.log(params);
      // Verificar se a mina pertence ao gestor
      const mine = await Mine.query()
        .where("id", params.mine_id)
        .andWhere("admin_id", manager.id)
        .first();

      if (!mine) {
        return response.notFound({
          message: "Mina não encontrada ou não pertence a você.",
        });
      }

      // Definir esquema de validação
      const validationSchema = schema.create({
        description: schema.string(),
      });

      // Validar dados da requisição
      const data = await request.validate({ schema: validationSchema });

      // Criar nova região
      const region = await Region.create({
        mine_id: mine.id,
        description: data.description,
      });

      return response.created({
        message: "Região criada com sucesso.",
        region,
      });
    } catch (error) {
      console.error(error);
      return response.internalServerError({
        message: "Erro ao criar a região.",
      });
    }
  }

  /**
   * Atualiza uma região específica.
   */
  public async update({
    auth,
    params,
    request,
    response,
  }: HttpContextContract) {
    try {
      const manager = auth.user;
      if (!manager) {
        return response.unauthorized({ message: "Não autorizado." });
      }

      // Verificar se a região pertence a uma mina gerenciada pelo gestor
      const region = await Region.query()
        .where("id", params.id)
        .andWhereHas("mine", (query) => {
          query.where("admin_id", manager.id);
        })
        .first();

      if (!region) {
        return response.notFound({
          message: "Região não encontrada ou não pertence a uma mina sua.",
        });
      }

      // Atualizar a descrição
      const data = request.only(["description"]);
      region.merge(data);
      await region.save();

      return response.ok({ message: "Região atualizada com sucesso.", region });
    } catch (error) {
      console.error(error);
      return response.internalServerError({
        message: "Erro ao atualizar a região.",
      });
    }
  }

  /**
   * Deleta uma região específica.
   */
  public async destroy({ auth, params, response }: HttpContextContract) {
    try {
      const manager = auth.user;
      if (!manager) {
        return response.unauthorized({ message: "Não autorizado." });
      }

      // Verificar se a região pertence a uma mina gerenciada pelo gestor
      const region = await Region.query()
        .where("id", params.id)
        .andWhereHas("mine", (query) => {
          query.where("admin_id", manager.id);
        })
        .first();

      if (!region) {
        return response.notFound({
          message: "Região não encontrada ou não pertence a uma mina sua.",
        });
      }

      await region.delete();
      return response.ok({ message: "Região deletada com sucesso." });
    } catch (error) {
      console.error(error);
      return response.internalServerError({
        message: "Erro ao deletar a região.",
      });
    }
  }
}
