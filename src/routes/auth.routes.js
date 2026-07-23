import { Router } from "express";
import { AppDataSource } from "../config/database_postgres.js";
import { UsuarioEntity } from "../entidades/Usuario.js";

const authRoutes = new Router();

const usuarioRepository = AppDataSource.getRepository(UsuarioEntity);

authRoutes.post("/auth/usuarios", async (request, response) => {
  const dados = request.body;

  const usuario = await usuarioRepository.save(dados);

  response.send(usuario);
});

export default authRoutes;
