import { EntitySchema } from "typeorm";

export const ChefEntity = new EntitySchema({
  name: "Chef",
  tableName: "chefs", // nome real de tabela
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    nome: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    faz_sobremesa: {
      type: "boolean",
      default: false,
    },
    especializacao: {
      type: "text",
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
});
