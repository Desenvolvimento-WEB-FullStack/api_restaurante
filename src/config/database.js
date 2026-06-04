import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const adapter = new JSONFile("database.json");
const db = new Low(adapter, {
  mesas: [],
  contador_mesas: 1,
  itemsCardapio: [],
  contador_items_cardapio: 1,
});
await db.read();

export default db;
