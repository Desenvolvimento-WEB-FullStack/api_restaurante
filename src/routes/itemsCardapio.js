import { Router } from "express";
import {
  BAD_REQUEST_ERROR,
  CREATED_SUCCESS_REQUEST,
  NOT_FOUND_ERROR,
} from "../constants/server.js";
import ItemCardapio from "../classes/ItemCardapio.js";

import { AppDataSource } from "../config/database_postgres.js";
import { ItemCardapioEntity } from "../entidades/ItemCardapio.js";

const routesItemsCardapio = new Router();

const itemCardapioRepository = AppDataSource.getRepository(ItemCardapioEntity);

routesItemsCardapio.put("/items-cardapio/:id", async (request, response) => {
  /* VALIDACAO FAZER DEPOIS */

  const dados = request.body;
  const idRecebido = Number(request.params.id);

  if (
    dados.hasOwnProperty("nome") &&
    (typeof dados.nome !== "string" || dados.nome.trim() === "")
  ) {
    response
      .status(BAD_REQUEST_ERROR)
      .send({ error: "O nome deve ser uma string" });
  } else if (
    dados.hasOwnProperty("tipo") &&
    (typeof dados.tipo !== "string" || dados.tipo.trim() === "")
  ) {
    response.status(BAD_REQUEST_ERROR).send({ error: "Tipo é obrigatório" });
  } else if (
    dados.hasOwnProperty("tamanho") &&
    dados.tamanho !== "P" &&
    dados.tamanho !== "M" &&
    dados.tamanho !== "G"
  ) {
    response
      .status(BAD_REQUEST_ERROR)
      .send({ error: "O tamanho deve ser P, M ou G" });
    return;
  } else if (
    dados.hasOwnProperty("porcoes") &&
    (typeof dados.porcoes !== "number" || dados.porcoes < 1)
  ) {
    response
      .status(BAD_REQUEST_ERROR)
      .send({ error: "As porcoes devem ser no minimo 1" });
  } else {
    await itemCardapioRepository.update(idRecebido, dados);

    response.send();
  }
});

routesItemsCardapio.delete("/items-cardapio/:id", async (request, response) => {
  const idRecebido = Number(request.params.id);

  const itemExisteNoDatabase = await itemCardapioRepository.existsBy({
    id: idRecebido,
  });

  if (!itemExisteNoDatabase) {
    response.status(NOT_FOUND_ERROR).send({ error: "Item nao encontrado" });
  } else {
    await itemCardapioRepository.delete(idRecebido);

    response.status(204).send();
  }
});

routesItemsCardapio.get("/items-cardapio", async (request, response) => {
  response.send(await itemCardapioRepository.find());
});

routesItemsCardapio.get("/items-cardapio/:id", async (request, response) => {
  const id = Number(request.params.id);

  const itemEncontrado = await itemCardapioRepository.findOneBy({ id: id });

  if (!itemEncontrado) {
    response.status(NOT_FOUND_ERROR).send({ error: "Item nao encontrado" });
  } else {
    response.send(itemEncontrado);
  }
});

routesItemsCardapio.post("/items-cardapio", async (request, response) => {
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
});

export default routesItemsCardapio;
