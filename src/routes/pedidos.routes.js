import { Router } from "express";
import { AppDataSource } from "../config/database_postgres.js";
import { PedidoEntity } from "../entidades/Pedido.js";
import {
  CREATED_SUCCESS_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND_ERROR,
} from "../constants/server.js";
import { MesaEntity } from "../entidades/Mesa.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { verifyIdExistsHandler } from "../middlewares/verifyIdExistsHandler.js";
import { autorizarHandler } from "../middlewares/autorizarHandler.js";
import { ROLES } from "../constants/roles.js";

const pedidosRoutes = new Router();
const pedidoRepository = AppDataSource.getRepository(PedidoEntity);
const mesaRepository = AppDataSource.getRepository(MesaEntity);

pedidosRoutes.put(
  "/pedidos/:id/fechar",
  autorizarHandler(ROLES.GARCOM, ROLES.GERENTE, ROLES.ADMIN),
  verifyIdExistsHandler(PedidoEntity, "Pedido"),
  asyncHandler(async (request, response) => {
    const idPedido = Number(request.params.id);
    const pedidoEncontrado = request.registro;

    // Somar todos os items do pedido
    const resultado = await AppDataSource.createQueryBuilder()
      .select("SUM(total_item)", "total")
      .from((subQuery) => {
        return subQuery
          .select("ic.nome", "nome")
          .addSelect("ip.quantidade * ic.preco", "total_item")
          .from("items_pedidos", "ip")
          .innerJoin("items_cardapio", "ic", "ip.item_cardapio_id = ic.id")
          .where("ip.pedido_id = :pedidoId", { pedidoId: idPedido });
      }, "pedido_items")
      .getRawOne();

    // Ir na tabela de pedidos e atualizar a coluna total e fechado para true
    await pedidoRepository.update(idPedido, {
      fechado: true,
      total: resultado.total || 0, // se valor for null, assume valor 0 para salvar no banco
    });

    // Ir na tabela de mesas e atualiza e liberar mesa(reservado = false)
    await mesaRepository.update(pedidoEncontrado.mesa_id, {
      reservado: false,
    });

    response.send(resultado);
  }),
);

pedidosRoutes.post(
  "/pedidos",
  autorizarHandler(ROLES.GARCOM, ROLES.GERENTE, ROLES.ADMIN),
  asyncHandler(async (request, response) => {
    const dados = request.body;
    /* Validacao AQUI */
    const mesa = await mesaRepository.findOneBy({ id: dados.mesa_id });

    if (mesa.reservado === true) {
      response.status(409).send({ error: "A mesa já está reservada" });
    } else {
      const novoPedido = await pedidoRepository.save(dados);
      await mesaRepository.update(dados.mesa_id, { reservado: true });

      response.status(CREATED_SUCCESS_REQUEST).send(novoPedido);
    }
  }),
);

/* Fazer uma rota que lista todos pedidos */
pedidosRoutes.get(
  "/pedidos",
  autorizarHandler(ROLES.GARCOM, ROLES.GERENTE, ROLES.ADMIN, ROLES.CHEF),
  asyncHandler(async (request, response) => {
    const todosPedidos = await pedidoRepository.find({
      relations: { mesa: true }, // faz o join com tabela mesas
    });
    response.send(todosPedidos);
  }),
);

/* Fazer uma rota que lista que um pedido pelo ID */

pedidosRoutes.get(
  "/pedidos/:id",
  autorizarHandler(ROLES.GARCOM, ROLES.GERENTE, ROLES.ADMIN, ROLES.CHEF),
  verifyIdExistsHandler(PedidoEntity, "Pedido"),
  asyncHandler(async (request, response) => {
    const pedidoEncontrado = await pedidoRepository.findOne({
      where: { id: Number(request.params.id) },
      relations: { mesa: true },
    });

    if (!pedidoEncontrado) {
      response
        .status(NOT_FOUND_ERROR)
        .send({ error: "Nao foi encontrado pedido com esse Id" });
      return;
    }

    response.send(pedidoEncontrado);
  }),
);

export default pedidosRoutes;
