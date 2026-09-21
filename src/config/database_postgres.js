import { DataSource } from "typeorm";
import { MesaEntity } from "../entidades/Mesa.js";
import { ItemCardapioEntity } from "../entidades/ItemCardapio.js";
import { ChefEntity } from "../entidades/Chef.js";
import { PedidoEntity } from "../entidades/Pedido.js";
import { AgendaChefEntity } from "../entidades/AgendaChef.js";
import { ItemPedidoEntity } from "../entidades/ItemPedido.js";
import { UsuarioEntity } from "../entidades/Usuario.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "restaurante",
  synchronize: false,
  logging: true,
  entities: [
    MesaEntity,
    ItemCardapioEntity,
    ChefEntity,
    PedidoEntity,
    AgendaChefEntity,
    ItemPedidoEntity,
    UsuarioEntity,
  ],
});
