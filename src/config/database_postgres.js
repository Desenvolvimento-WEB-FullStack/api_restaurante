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
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "restaurante",
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
