import { Router } from "express";
import { AppDataSource } from "../config/database_postgres.js";
import { PedidoEntity } from "../entidades/Pedido.js";
import { MesaEntity } from "../entidades/Mesa.js";

const routesPedidos = new Router();

const pedidoRepository = AppDataSource.getRepository(PedidoEntity);
const mesaRepository = AppDataSource.getRepository(MesaEntity);

routesPedidos.post("/pedidos", async (request, response) => {
  const dados = request.body;
  // validacao
  const novoPedido = await pedidoRepository.save(dados);

  await mesaRepository.update(dados.mesa_id, { reservado: true });

  response.send(novoPedido);
});

export default routesPedidos;
