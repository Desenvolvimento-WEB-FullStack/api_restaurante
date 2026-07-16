import express from "express";
import cors from "cors";

import routesMesas from "./routes/mesas.js";
import routesItemsCardapio from "./routes/itemsCardapio.js";
import routesPedidos from "./routes/pedidos.routes.js";
import chefsRoutes from "./routes/chefs.routes.js";

import { PORTA } from "./constants/server.js";
import { AppDataSource } from "./config/database_postgres.js";

const app = express();
app.use(express.json()); // habilita o servidor para reconhecer formato JSON
app.use(cors());

app.use(routesMesas);
app.use(routesItemsCardapio);
app.use(routesPedidos);
app.use(chefsRoutes);

try {
  await AppDataSource.initialize();
  app.listen(PORTA, () => {
    console.log("Servidor rodando");
  });
} catch (error) {
  console.log("Erro ao conectar com o banco de dados", error);
}
