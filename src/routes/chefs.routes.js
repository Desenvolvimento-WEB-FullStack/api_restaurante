import { response, Router } from "express";
import { AppDataSource } from "../config/database_postgres.js";
import { ChefEntity } from "../entidades/Chef.js";
import {
  CREATED_SUCCESS_REQUEST,
  NOT_FOUND_ERROR,
} from "../constants/server.js";

const chefsRoutes = new Router();

const chefRepository = AppDataSource.getRepository(ChefEntity);

chefsRoutes.post("/chefs", async (request, response) => {
  const dados = request.body; // recuperar os valores vindo do body

  /* FAZER VALIDACAO */

  const chefCriado = await chefRepository.save(dados);

  response.status(CREATED_SUCCESS_REQUEST).send(chefCriado);
});

chefsRoutes.get("/chefs", async (request, response) => {
  const chefs = await chefRepository.find();
  response.send(chefs);
});

chefsRoutes.get("/chefs/:id", async (request, response) => {
  const id = request.params.id;

  const chefEncontrado = await chefRepository.findOneBy({ id });

  if (chefEncontrado) {
    response.send(chefEncontrado);
  } else {
    response
      .status(NOT_FOUND_ERROR)
      .send({ error: "Chef nao encontrado pelo id" });
  }
});

export default chefsRoutes;
