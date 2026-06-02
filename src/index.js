import express from "express";
import {
  BAD_REQUEST_ERROR,
  CREATED_SUCCESS_REQUEST,
  PORTA,
} from "./constants/server.js";
import Mesa from "./classes/Mesa.js";

const app = express();
app.use(express.json()); // habilita o servidor para reconhecer formato JSON

app.post("/mesas", async (request, response) => {
  const dados = request.body;

  if (!dados.nome || typeof dados.nome !== "string") {
    response.status(BAD_REQUEST_ERROR).send({ error: "Nome é obrigatório" });
  } else {
    const mesa = new Mesa(dados.nome);
    const data = await mesa.criar();

    response.status(CREATED_SUCCESS_REQUEST).send(novaMesa);
  }
});

app.listen(PORTA, () => {
  console.log("Servidor rodando");
});
