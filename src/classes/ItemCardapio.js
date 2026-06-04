import db from "../config/database.js";

class ItemCardapio {
  constructor(nome, preco, tipo) {
    this.nome = nome;
    this.preco = preco;
    this.tipo = tipo;
  }

  async criar() {
    const novoItem = {
      id: db.data.contador_items_cardapio++,
      nome: this.nome,
      preco: this.preco,
      tipo: this.tipo,
    };

    db.data.itemsCardapio.push(novoItem);

    await db.write();

    return novoItem;
  }

  static listarTodos() {
    return db.data.itemsCardapio;
  }

  static verificarExistencia(id) {
    const existe = db.data.itemsCardapio.some((item) => item.id === id);
    return existe;
  }

  static async deletar(id) {
    const itemsFiltrados = db.data.itemsCardapio.filter(
      (item) => item.id !== id,
    );

    db.data.itemsCardapio = itemsFiltrados;

    await db.write();
  }

  static async atualizar(id, dados) {
    const itemsAlterados = db.data.itemsCardapio.map((item) => {
      if (item.id === id) {
        if (dados.nome) item.nome = dados.nome;
        if (dados.preco) item.preco = dados.preco;
        if (dados.tipo) item.tipo = dados.tipo;
      }
      return item;
    });

    db.data.itemsCardapio = itemsAlterados;

    await db.write();
  }
}

export default ItemCardapio;
