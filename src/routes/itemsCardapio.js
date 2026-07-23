import { Router } from "express";
import {
  BAD_REQUEST_ERROR,
  CREATED_SUCCESS_REQUEST,
  NOT_FOUND_ERROR,
} from "../constants/server.js";

import { AppDataSource } from "../config/database_postgres.js";
import { ItemCardapioEntity } from "../entidades/ItemCardapio.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { verifyIdExistsHandler } from "../middlewares/verifyIdExistsHandler.js";
import { validateUpdateItemCardapio } from "../middlewares/validations/items_cadarpio/validateUpdateItemCardapio.js";

const routesItemsCardapio = new Router();

const itemCardapioRepository = AppDataSource.getRepository(ItemCardapioEntity);

routesItemsCardapio.put(
  "/items-cardapio/:id",
  verifyIdExistsHandler(ItemCardapioEntity, "Item do cardápio"),
  validateUpdateItemCardapio,
  asyncHandler(async (request, response) => {
    const dados = request.body;
    const idRecebido = Number(request.params.id);

    await itemCardapioRepository.update(idRecebido, dados);

    response.send();
  }),
);

routesItemsCardapio.delete(
  "/items-cardapio/:id",
  verifyIdExistsHandler(ItemCardapioEntity, "Item do cardápio"),
  asyncHandler(async (request, response) => {
    const idRecebido = Number(request.params.id);

    await itemCardapioRepository.delete(idRecebido);

    response.status(204).send();
  }),
);

routesItemsCardapio.get(
  "/items-cardapio",
  asyncHandler(async (request, response) => {
    response.send(await itemCardapioRepository.find());
  }),
);

routesItemsCardapio.get(
  "/items-cardapio/:id",
  verifyIdExistsHandler(ItemCardapioEntity, "Item do cardápio"),
  asyncHandler(async (request, response) => {
    response.send(request.registro);
  }),
);

routesItemsCardapio.post(
  "/items-cardapio",
  asyncHandler(async (request, response) => {
    const dados = request.body;

    if (!dados.nome || typeof dados.nome !== "string") {
      response.status(BAD_REQUEST_ERROR).send({ error: "nome é obrigatório" });
    } else if (dados.preco < 0 || typeof dados.preco !== "number") {
      response
        .status(BAD_REQUEST_ERROR)
        .send({ error: "preco é obrigatório e nao negativo" });
    } else if (!dados.tipo || typeof dados.tipo !== "string") {
      response.status(BAD_REQUEST_ERROR).send({ error: "Tipo é obrigatório" });
    } else if (
      dados.tamanho !== "P" &&
      dados.tamanho !== "M" &&
      dados.tamanho !== "G"
    ) {
      response
        .status(BAD_REQUEST_ERROR)
        .send({ error: "O tamanho deve ser P, M ou G" });
    } else if (!dados.porcoes || typeof dados.porcoes !== "number") {
      response
        .status(BAD_REQUEST_ERROR)
        .send({ error: "As porcoes devem ser no minimo 1" });
    } else {
      const novoItemCardapio = await itemCardapioRepository.save(dados);
      response.status(CREATED_SUCCESS_REQUEST).send(novoItemCardapio);
    }
  }),
);

export default routesItemsCardapio;
