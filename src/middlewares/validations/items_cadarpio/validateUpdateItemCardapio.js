import { BAD_REQUEST_ERROR } from "../../../constants/server.js";

export function validateUpdateItemCardapio(request, response, next) {
  const dados = request.body;

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
    next();
  }
}
