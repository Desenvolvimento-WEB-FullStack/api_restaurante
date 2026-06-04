import express from "express";
import { PORTA } from "./constants/server.js";

import db from "./config/database.js";
import routesMesas from "./routes/mesas.js";
import routesItemsCardapio from "./routes/itemsCardapio.js";

const app = express();
app.use(express.json()); // habilita o servidor para reconhecer formato JSON

app.use(routesMesas);
app.use(routesItemsCardapio);

app.listen(PORTA, () => {
  console.log("Servidor rodando");
});
