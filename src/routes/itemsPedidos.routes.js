import { Router } from "express";
import { AppDataSource } from "../config/database_postgres.js";

import { ItemPedidoEntity } from "../entidades/ItemPedido.js";
import { PedidoEntity } from "../entidades/Pedido.js";
import { ItemCardapioEntity } from "../entidades/ItemCardapio.js";

import {
  CREATED_SUCCESS_REQUEST,
  NOT_FOUND_ERROR,
} from "../constants/server.js";

const itemsPedidosRoutes = new Router();

const itemPedidoRepository = AppDataSource.getRepository(ItemPedidoEntity);
const pedidoRepitory = AppDataSource.getRepository(PedidoEntity);
const itemCardapioRepository = AppDataSource.getRepository(ItemCardapioEntity);

itemsPedidosRoutes.post("/items-pedidos", async (request, response) => {
  const dados = request.body;

  /* Validação */

  const pedidoEncontrado = await pedidoRepitory.existsBy({
    id: dados.pedido_id,
  });

  const itemCardapioEncontrado = await itemCardapioRepository.existsBy({
    id: dados.item_cardapio_id,
  });

  if (!pedidoEncontrado) {
    response
      .status(NOT_FOUND_ERROR)
      .send({ error: "O pedido não foi encontrado" });
  } else if (!itemCardapioEncontrado) {
    response
      .status(NOT_FOUND_ERROR)
      .send({ error: "O item do cardapio não foi encontrado" });
  } else {
    const itemAdicionado = await itemPedidoRepository.save(dados);

    response.status(CREATED_SUCCESS_REQUEST).send(itemAdicionado);
  }
});

export default itemsPedidosRoutes;
