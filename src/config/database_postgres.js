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
  host: "2.25.233.101",
  port: 5432,
  username: "postgres",
  password: "vRJlp9IteelpIqt4wQVeKxiUQJ7rC0gKaYXGt8bJsBK8dXlGs1C4jSwpM41hKKHQ",
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
