import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

class Mesa {
  constructor(nome) {
    this.nome = nome;
  }

  async criar() {
    /* Configuração do JSON */
    const adapter = new JSONFile("database.json");
    const db = new Low(adapter, { mesas: [], contador_mesas: 1 });
    await db.read();
    /* Fim do configuração do JSON */

    const novaMesa = {
      id: db.data.contador_mesas++,
      nome: this.nome,
    };

    db.data.mesas.push(novaMesa);

    await db.write();

    return novaMesa;
  }
}

export default Mesa;
