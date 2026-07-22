import express from "express";
import cors from "cors";

import routesMesas from "./routes/mesas.js";
import routesItemsCardapio from "./routes/itemsCardapio.js";
import routesPedidos from "./routes/pedidos.routes.js";
import chefsRoutes from "./routes/chefs.routes.js";
import agendaChefs from "./routes/agendaChefs.routes.js";
import itemsPedidosRoutes from "./routes/itemsPedidos.routes.js";

import { PORTA } from "./constants/server.js";
import { AppDataSource } from "./config/database_postgres.js";
import { captureLog } from "./middlewares/captureLog.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json()); // habilita o servidor para reconhecer formato JSON
app.use(cors());

app.use(captureLog); // aplicando o middleware de forma global no inicio de cada rota

app.use(routesMesas);
app.use(routesItemsCardapio);
app.use(routesPedidos);
app.use(chefsRoutes);
app.use(agendaChefs);
app.use(itemsPedidosRoutes);

app.use(errorHandler); // aplicando o middleware de forma global no fim de cada rota

try {
  await AppDataSource.initialize();
  app.listen(PORTA, () => {
    console.log("Servidor rodando");
  });
} catch (error) {
  console.log("Erro ao conectar com o banco de dados", error);
}
