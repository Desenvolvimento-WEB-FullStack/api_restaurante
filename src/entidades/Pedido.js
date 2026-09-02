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
    fechado: {
      type: "boolean",
      nullable: false,
      default: false,
    },
    data: {
      type: "date",
      nullable: false,
    },
    total: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: true,
    },
    criado_em: {
      type: "timestamp with time zone",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
    },
    atualizado_em: {
      type: "timestamp with time zone",
      nullable: false,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    mesa: {
      type: "many-to-one",
      target: "Mesa",
      joinColumn: {
        name: "mesa_id",
        referencedColumnName: "id",
      },
      nullable: false,
    },
    items: {
      type: "one-to-many",
      target: "ItemPedido",
      inverseSide: "pedido",
    },
  },
});
