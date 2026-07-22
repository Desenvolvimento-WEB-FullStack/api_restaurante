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

const pedidosRoutes = new Router();
const pedidoRepository = AppDataSource.getRepository(PedidoEntity);
const mesaRepository = AppDataSource.getRepository(MesaEntity);

pedidosRoutes.put(
  "/pedidos/:id/fechar",
  asyncHandler(async (request, response) => {
    const idPedido = request.params.id;

    const pedidoEncontrado = await pedidoRepository.findOneBy({ id: idPedido });

    if (!pedidoEncontrado) {
      response.status(NOT_FOUND_ERROR).send({ error: "Pedido nao encontrado" });
    } else {
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
    }
  }),
);

pedidosRoutes.post(
  "/pedidos",
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
  asyncHandler(async (request, response) => {
    const id = request.params.id;

    const pedidoEncontrado = await pedidoRepository.findOne({
      where: { id },
      relations: { mesa: true }, // faz o join com tabela mesas
    });

    if (pedidoEncontrado) {
      response.send(pedidoEncontrado);
    } else {
      response
        .status(NOT_FOUND_ERROR)
        .send({ error: "Nao foi encontrado pedido com esse Id" });
    }
  }),
);

export default pedidosRoutes;

/* Uma rota POST para /pedidos que receba mesa_id, nome_cliente e data */
