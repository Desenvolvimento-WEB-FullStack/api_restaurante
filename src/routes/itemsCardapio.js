import { Router } from "express";
import {
  BAD_REQUEST_ERROR,
  CREATED_SUCCESS_REQUEST,
  NOT_FOUND_ERROR,
} from "../constants/server.js";
import ItemCardapio from "../classes/ItemCardapio.js";

const routesItemsCardapio = new Router();

routesItemsCardapio.put("/items-cardapio/:id", async (request, response) => {
  /* VALIDACAO FAZER DEPOIS */
  const dados = request.body;
  const idRecebido = Number(request.params.id);

  await ItemCardapio.atualizar(idRecebido, dados);

  response.send("atualizou");
});

routesItemsCardapio.delete("/items-cardapio/:id", (request, response) => {
  const idRecebido = Number(request.params.id);

  const itemExisteNoDatabase = ItemCardapio.verificarExistencia(idRecebido);

  if (!itemExisteNoDatabase) {
    response.status(NOT_FOUND_ERROR).send({ error: "Item nao encontrado" });
  } else {
    ItemCardapio.deletar(idRecebido);

    response.status(204).send();
  }
});

routesItemsCardapio.get("/items-cardapio", (request, response) => {
  response.send(ItemCardapio.listarTodos());
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
  } else {
    const item = new ItemCardapio(dados.nome, dados.preco, dados.tipo);
    const itemCriado = await item.criar();
    response.status(CREATED_SUCCESS_REQUEST).send(itemCriado);
  }
});

export default routesItemsCardapio;
