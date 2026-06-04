import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import db from "../config/database.js";

class Mesa {
  constructor(nome) {
    this.nome = nome;
  }

  static listarTodos() {
    return db.data.mesas;
  }

  async criar() {
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
