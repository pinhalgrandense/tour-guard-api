import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Region from "App/Models/Region";
import RegionFact from "App/Models/RegionFact";

import { schema } from "@ioc:Adonis/Core/Validator";

export default class RegionFactsController {
  /**
   * Lista todos os fatos de uma região específica.
   */
  public async index({ params, auth, response }: HttpContextContract) {
    try {
      const manager = auth.user;
      if (!manager) {
        return response.unauthorized({ message: "Não autorizado." });
      }

      // Verificar se a região pertence a uma mina gerenciada pelo gestor
      const region = await Region.query()
        .where("id", params.regionId)
        .andWhereHas("mine", (query) => {
          query.where("admin_id", manager.id);
        })
        .first();

      if (!region) {
        return response.notFound({
          message: "Região não encontrada ou não pertence a uma mina sua.",
        });
      }

      // Listar fatos da região
      const facts = await RegionFact.query().where("region_id", region.id);
      return response.ok({ facts });
    } catch (error) {
      console.error(error);
      return response.internalServerError({
        message: "Erro ao listar os fatos.",
      });
    }
  }

  /**
   * Cria um novo fato para uma região.
   */
  public async store({ params, request, auth, response }: HttpContextContract) {
    try {
      const manager = auth.user;
      if (!manager) {
        return response.unauthorized({ message: "Não autorizado." });
      }

      // Verificar se a região pertence a uma mina gerenciada pelo gestor
      const region = await Region.query()
        .where("id", params.regionId)
        .andWhereHas("mine", (query) => {
          query.where("admin_id", manager.id);
        })
        .first();

      if (!region) {
        return response.notFound({
          message: "Região não encontrada ou não pertence a uma mina sua.",
        });
      }

      // Definir esquema de validação
      const validationSchema = schema.create({
        title: schema.string(),
        description: schema.string(),
      });

      // Validar entrada de dados com await
      const data = await request.validate({ schema: validationSchema });

      // Criar fato
      const fact = await RegionFact.create({
        region_id: region.id,
        title: data.title,
        description: data.description,
      });

      return response.created({ message: "Fato criado com sucesso.", fact });
    } catch (error) {
      console.error(error);
      return response.internalServerError({ message: "Erro ao criar o fato." });
    }
  }

  /**
   * Atualiza um fato existente.
   */
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

      // Verificar se o fato pertence a uma região de uma mina gerenciada pelo gestor
      const fact = await RegionFact.query()
        .where("id", params.id)
        .andWhereHas("region", (query) => {
          query.whereHas("mine", (query) => {
            query.where("admin_id", manager.id);
          });
        })
        .first();

      if (!fact) {
        return response.notFound({
          message: "Fato não encontrado ou não pertence a uma mina sua.",
        });
      }

      // Atualizar fato
      const data = request.only(["title", "description"]);
      fact.merge(data);
      await fact.save();

      return response.ok({ message: "Fato atualizado com sucesso.", fact });
    } catch (error) {
      console.error(error);
      return response.internalServerError({
        message: "Erro ao atualizar o fato.",
      });
    }
  }

  /**
   * Deleta um fato específico.
   */
  public async destroy({ params, auth, response }: HttpContextContract) {
    try {
      const manager = auth.user;
      if (!manager) {
        return response.unauthorized({ message: "Não autorizado." });
      }

      // Verificar se o fato pertence a uma região de uma mina gerenciada pelo gestor
      const fact = await RegionFact.query()
        .where("id", params.id)
        .andWhereHas("region", (query) => {
          query.whereHas("mine", (query) => {
            query.where("admin_id", manager.id);
          });
        })
        .first();

      if (!fact) {
        return response.notFound({
          message: "Fato não encontrado ou não pertence a uma mina sua.",
        });
      }

      await fact.delete();
      return response.ok({ message: "Fato deletado com sucesso." });
    } catch (error) {
      console.error(error);
      return response.internalServerError({
        message: "Erro ao deletar o fato.",
      });
    }
  }
}
