import { Router } from "express";

import {
  BAD_REQUEST_ERROR,
  CREATED_SUCCESS_REQUEST,
} from "../constants/server.js";
import { MesaEntity } from "../entidades/Mesa.js";
import { AppDataSource } from "../config/database_postgres.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const routesMesas = new Router();
const mesaRepository = AppDataSource.getRepository(MesaEntity);

routesMesas.get(
  "/mesas",
  asyncHandler(async (request, response) => {
    response.send(await mesaRepository.find());
  }),
);

routesMesas.post(
  "/mesas",
  asyncHandler(async (request, response) => {
    const dados = request.body;

    if (!dados.nome || typeof dados.nome !== "string") {
      response.status(BAD_REQUEST_ERROR).send({ error: "Nome é obrigatório" });
    } else {
      const novaMesa = await mesaRepository.save(dados);

      response.status(CREATED_SUCCESS_REQUEST).send(novaMesa);
    }
  }),
);

export default routesMesas;
