import express from "express";
import { PORTA } from "./constants/server.js";

import routesMesas from "./routes/mesas.js";
import routesItemsCardapio from "./routes/itemsCardapio.js";

import cors from "cors";
import { AppDataSource } from "./config/database_postgres.js";
import routesPedidos from "./routes/pedidos.js";

const app = express();
app.use(express.json()); // habilita o servidor para reconhecer formato JSON
app.use(cors());

app.use(routesMesas);
app.use(routesItemsCardapio);
app.use(routesPedidos);

try {
  await AppDataSource.initialize();
  app.listen(PORTA, () => {
    console.log("Servidor rodando");
  });
} catch (error) {
  console.log("Erro ao conectar com o banco de dados", error);
}
