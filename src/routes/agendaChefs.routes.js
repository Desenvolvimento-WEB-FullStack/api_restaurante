import { Router } from "express";
import { AppDataSource } from "../config/database_postgres.js";
import {
  CREATED_SUCCESS_REQUEST,
  INTERNAL_SERVER_ERROR,
} from "../constants/server.js";
import { AgendaChefEntity } from "../entidades/AgendaChef.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const agendaChefs = new Router();
const agendaChefRepository = AppDataSource.getRepository(AgendaChefEntity);

agendaChefs.get(
  "/agenda-chefs",
  asyncHandler(async (request, response) => {
    const agendas = await agendaChefRepository.find({
      relations: { chef: true },
    });
    response.send(agendas);
  }),
);

// chef_id, semana, mes, dias_semana
agendaChefs.post(
  "/agenda-chefs",
  asyncHandler(async (request, response) => {
    const dados = request.body;
    // validação

    const agendaEncontrada = await agendaChefRepository.findOneBy({
      semana: dados.semana,
      mes: dados.mes,
      chef_id: dados.chef_id,
    });

    if (agendaEncontrada) {
      response.status(409).send({ error: "Ja tem uma agenda para o chef" });
    } else {
      const agendaCriada = await agendaChefRepository.save(dados);
      response.status(CREATED_SUCCESS_REQUEST).send(agendaCriada);
    }
  }),
);

export default agendaChefs;
