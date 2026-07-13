import { EntitySchema } from "typeorm";

export const PedidoEntity = new EntitySchema({
  name: "Pedido",
  tableName: "pedidos",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    nome_cliente: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    mesa_id: {
      type: "int",
      nullable: false,
    },
  },
});
