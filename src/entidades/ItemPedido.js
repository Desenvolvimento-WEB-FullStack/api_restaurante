import { EntitySchema } from "typeorm";

export const ItemPedidoEntity = new EntitySchema({
  name: "ItemPedido",
  tableName: "items_pedidos",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: "increment",
    },
    pedido_id: {
      type: "int",
      nullable: false,
    },
    item_cardapio_id: {
      type: "int",
      nullable: false,
    },
    quantidade: {
      type: "int",
      nullable: false,
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
      type: "many-to-one",
      target: "Pedido",
      joinColumn: {
        name: "pedido_id",
        referencedColumnName: "id",
      },
      nullable: false,
    },
    itemCardapio: {
      type: "many-to-one",
      target: "ItemCardapio",
      joinColumn: {
        name: "item_cardapio_id",
        referencedColumnName: "id",
      },
      nullable: false,
    },
  },
});
