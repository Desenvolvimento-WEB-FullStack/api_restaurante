import { EntitySchema } from "typeorm";

export const AgendaChefEntity = new EntitySchema({
  name: "AgendaChef",
  tableName: "agenda_chefs",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    chef_id: {
      type: "int",
      nullable: false,
    },
    semana: {
      type: "int",
      nullable: false,
    },
    mes: {
      type: "bigint",
      nullable: false,
    },
    segunda: {
      type: "boolean",
      nullable: false,
      default: false,
    },
    terca: {
      type: "boolean",
      nullable: false,
      default: false,
    },
    quarta: {
      type: "boolean",
      nullable: false,
      default: false,
    },
    quinta: {
      type: "boolean",
      nullable: false,
      default: false,
    },
    sexta: {
      type: "boolean",
      nullable: false,
      default: false,
    },
    sabado: {
      type: "boolean",
      nullable: false,
      default: false,
    },
    domingo: {
      type: "boolean",
      nullable: false,
      default: false,
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
    chef: {
      type: "many-to-one",
      target: "Chef",
      joinColumn: {
        name: "chef_id",
        referencedColumnName: "id",
      },
      nullable: false,
    },
  },
});
