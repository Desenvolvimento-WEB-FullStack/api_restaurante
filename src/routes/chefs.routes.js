import { Router } from "express";
import { AppDataSource } from "../config/database_postgres.js";
import { ChefEntity } from "../entidades/Chef.js";
import {
  CREATED_SUCCESS_REQUEST,
  NOT_FOUND_ERROR,
  SUCCESS_WITHOUT_RESPONSE,
} from "../constants/server.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { verifyIdExistsHandler } from "../middlewares/verifyIdExistsHandler.js";

const chefsRoutes = new Router();

const chefRepository = AppDataSource.getRepository(ChefEntity);

chefsRoutes.post(
  "/chefs",
  asyncHandler(async (request, response) => {
    const dados = request.body; // recuperar os valores vindo do body

    /* FAZER VALIDACAO */

    const chefCriado = await chefRepository.save(dados);

    response.status(CREATED_SUCCESS_REQUEST).send(chefCriado);
  }),
);

chefsRoutes.get(
  "/chefs",
  asyncHandler(async (request, response) => {
    const chefs = await chefRepository.find();
    response.send(chefs);
  }),
);

chefsRoutes.get(
  "/chefs/:id",
  verifyIdExistsHandler(ChefEntity, "Chef"),
  asyncHandler(async (request, response) => {
    response.send(request.registro);
  }),
);

chefsRoutes.put(
  "/chefs/:id",
  verifyIdExistsHandler(ChefEntity, "Chef"),
  asyncHandler(async (request, response) => {
    const id = Number(request.params.id);
    const dados = request.body;

    // VALIDACAO

    await chefRepository.update(id, dados);
    const dadosChefAtualizado = await chefRepository.findOneBy({ id });
    response.send(dadosChefAtualizado);
  }),
);

chefsRoutes.delete(
  "/chefs/:id",
  verifyIdExistsHandler(ChefEntity, "Chef"),
  asyncHandler(async (request, response) => {
    const id = Number(request.params.id);
    const chefEncontrado = request.registro;

    if (chefEncontrado.faz_sobremesa === true) {
      response
        .status(409)
        .send({ error: "Chef nao pode ser deletado, pois faz sobremesa" });
    } else {
      await chefRepository.delete(id);
      response.status(SUCCESS_WITHOUT_RESPONSE).send();
    }
  }),
);

export default chefsRoutes;
