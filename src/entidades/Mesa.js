import { EntitySchema } from "typeorm";

export const MesaEntity = new EntitySchema({
  name: "Mesa",
  tableName: "mesas",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    nome: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    reservado: {
      type: "boolean",
      nullable: false,
      default: false,
    },
    quantidade_lugares: {
      type: "int",
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
    pedido: {
      type: "one-to-many",
      target: "Pedido",
      inverseSide: "mesa",
    },
  },
});
