import { DataSource } from "typeorm";
import { MesaEntity } from "../entidades/Mesa.js";
import { ItemCardapioEntity } from "../entidades/ItemCardapio.js";
import { PedidoEntity } from "../entidades/Pedido.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "restaurante",
  synchronize: false,
  logging: true,
  entities: [MesaEntity, ItemCardapioEntity, PedidoEntity],
});
