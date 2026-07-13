import { EntitySchema } from "typeorm";

export const ItemCardapioEntity = new EntitySchema({
  name: "ItemCardapio",
  tableName: "items_cardapio",
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
    preco: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    tipo: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    porcoes: {
      type: "int",
      nullable: false,
    },
    tamanho: {
      type: "enum",
      enum: ["P", "M", "G"],
      nullable: false,
    },
    vegetariano: {
      type: "boolean",
      default: false,
      nullable: false,
    },
    descricao: {
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
