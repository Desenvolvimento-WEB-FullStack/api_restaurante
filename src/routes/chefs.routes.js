import { response, Router } from "express";
import { AppDataSource } from "../config/database_postgres.js";
import { ChefEntity } from "../entidades/Chef.js";
import {
  CREATED_SUCCESS_REQUEST,
  NOT_FOUND_ERROR,
  SUCCESS_WITHOUT_RESPONSE,
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

chefsRoutes.put("/chefs/:id", async (request, response) => {
  const id = request.params.id;
  const dados = request.body;

  // VALIDACAO

  const chefEncontrado = await chefRepository.existsBy({ id });

  if (chefEncontrado) {
    await chefRepository.update(id, dados);
    const dadosChefAtualizado = await chefRepository.findOneBy({ id });
    response.send(dadosChefAtualizado);
  } else {
    response
      .status(NOT_FOUND_ERROR)
      .send({ error: "Chef nao encontrado pelo id" });
  }
});

chefsRoutes.delete("/chefs/:id", async (request, response) => {
  const id = request.params.id;

  const chefEncontrado = await chefRepository.findOneBy({ id });

  if (!chefEncontrado) {
    response
      .status(NOT_FOUND_ERROR)
      .send({ error: "Chef nao encontrado pelo id" });
  } else if (chefEncontrado.faz_sobremesa === true) {
    response
      .status(409)
      .send({ error: "Chef nao pode ser deletado, pois faz sobremesa" });
  } else {
    await chefRepository.delete(id);
    response.status(SUCCESS_WITHOUT_RESPONSE).send();
  }
});

export default chefsRoutes;
