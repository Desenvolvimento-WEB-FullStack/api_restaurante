import { Router } from "express";
import Mesa from "../classes/Mesa.js";
import {
  BAD_REQUEST_ERROR,
  CREATED_SUCCESS_REQUEST,
} from "../constants/server.js";

const routesMesas = new Router();

routesMesas.get("/mesas", async (request, response) => {
  response.send(Mesa.listarTodos());
});

routesMesas.post("/mesas", async (request, response) => {
  const dados = request.body;

  if (!dados.nome || typeof dados.nome !== "string") {
    response.status(BAD_REQUEST_ERROR).send({ error: "Nome é obrigatório" });
  } else {
    const mesa = new Mesa(dados.nome);
    const data = await mesa.criar();

    response.status(CREATED_SUCCESS_REQUEST).send(data);
  }
});

export default routesMesas;
