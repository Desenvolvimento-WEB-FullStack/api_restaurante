import { response, Router } from "express";
import { AppDataSource } from "../config/database_postgres.js";
import {
  CREATED_SUCCESS_REQUEST,
  INTERNAL_SERVER_ERROR,
} from "../constants/server.js";
import { AgendaChefEntity } from "../entidades/AgendaChef.js";

const agendaChefs = new Router();
const agendaChefRepository = AppDataSource.getRepository(AgendaChefEntity);

agendaChefs.get("/agenda-chefs", async (request, response) => {
  try {
    const agendas = await agendaChefRepository.find({
      relations: { chef: true },
    });
    response.send(agendas);
  } catch {
    response
      .status(INTERNAL_SERVER_ERROR)
      .send({ error: "Não foi possível lista as agendas dos chefs" });
  }
});

// chef_id, semana, mes, dias_semana
agendaChefs.post("/agenda-chefs", async (request, response) => {
  try {
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
  } catch {
    response
      .status(INTERNAL_SERVER_ERROR)
      .send({ error: "Não foi possível adicionar agenda ao chef no momento" });
  }
});

export default agendaChefs;
