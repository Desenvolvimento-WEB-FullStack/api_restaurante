import { Router } from "express";

import {
  BAD_REQUEST_ERROR,
  CREATED_SUCCESS_REQUEST,
} from "../constants/server.js";
import { ROLES } from "../constants/roles.js";

import { MesaEntity } from "../entidades/Mesa.js";
import { AppDataSource } from "../config/database_postgres.js";

import { asyncHandler } from "../middlewares/asyncHandler.js";
import { validateJwtHandler } from "../middlewares/validateJwtHandler.js";
import { autorizarHandler } from "../middlewares/autorizarHandler.js";

const routesMesas = new Router();
const mesaRepository = AppDataSource.getRepository(MesaEntity);

routesMesas.get(
  "/mesas",
  autorizarHandler(ROLES.ADMIN, ROLES.GARCOM, ROLES.GERENTE),
  asyncHandler(async (request, response) => {
    const mesas = await mesaRepository
      .createQueryBuilder("mesa")
      .leftJoin("mesa.pedido", "pedido", "pedido.fechado = false")
      .select([
        "mesa.id AS id",
        "mesa.nome AS nome",
        "mesa.reservado AS reservado",
        "mesa.quantidade_lugares AS quantidade_lugares",
        "mesa.criado_em AS criado_em",
        "mesa.atualizado_em AS atualizado_em",
        "pedido.id AS pedido_atual_id",
      ])
      .getRawMany();

    response.send(mesas);
  }),
);

routesMesas.post(
  "/mesas",
  autorizarHandler(ROLES.ADMIN, ROLES.GERENTE),
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
