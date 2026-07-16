import { Router } from "express";
import { AppDataSource } from "../config/database_postgres.js";
import { PedidoEntity } from "../entidades/Pedido.js";
import {
  CREATED_SUCCESS_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND_ERROR,
} from "../constants/server.js";
import { MesaEntity } from "../entidades/Mesa.js";

const pedidosRoutes = new Router();
const pedidoRepository = AppDataSource.getRepository(PedidoEntity);
const mesaRepository = AppDataSource.getRepository(MesaEntity);

pedidosRoutes.post("/pedidos", async (request, response) => {
  try {
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
  } catch (error) {
    console.log(error.message);
    response
      .status(INTERNAL_SERVER_ERROR)
      .send({ error: "Não foi possivel cadastrar um pedido no momento " });
  }
});

/* Fazer uma rota que lista todos pedidos */
pedidosRoutes.get("/pedidos", async (request, response) => {
  try {
    const todosPedidos = await pedidoRepository.find({
      relations: { mesa: true }, // faz o join com tabela mesas
    });
    response.send(todosPedidos);
  } catch (error) {
    console.log(error);
    response
      .status(INTERNAL_SERVER_ERROR)
      .send({ error: "Nao foi possivel listar todos os pedidos no momento" });
  }
});

/* Fazer uma rota que lista que um pedido pelo ID */

pedidosRoutes.get("/pedidos/:id", async (request, response) => {
  try {
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
  } catch (error) {
    console.log(error);
    response.status(INTERNAL_SERVER_ERROR).send({
      error: "Nao foi possivel listar os dados desse pedido no momento",
    });
  }
});

export default pedidosRoutes;

/* Uma rota POST para /pedidos que receba mesa_id, nome_cliente e data */
