import { Router } from "express";
import { AppDataSource } from "../config/database_postgres.js";
import { UsuarioEntity } from "../entidades/Usuario.js";

import {
  CREATED_SUCCESS_REQUEST,
  CONFLICT_ERROR,
  BAD_REQUEST_ERROR,
} from "../constants/server.js";

import bcrypt from "bcrypt"; // lib gerar hash da senha
import jwt from "jsonwebtoken"; // lib que vai gerar o token do usuario
import { autorizarHandler } from "../middlewares/autorizarHandler.js";
import { ROLES } from "../constants/roles.js";

const authRoutes = new Router();

const usuarioRepository = AppDataSource.getRepository(UsuarioEntity);

authRoutes.post(
  "/auth/usuarios",
  autorizarHandler(ROLES.ADMIN),
  async (request, response) => {
    const dados = request.body;

    // Fazer validação

    const usuarioEncontrado = await usuarioRepository.existsBy({
      email: dados.email,
    });

    if (usuarioEncontrado) {
      response.status(CONFLICT_ERROR).send({ error: "O email já existe" });
    } else {
      const senhaHash = await bcrypt.hash(dados.senha, 12);

      // criar um novo objeto apartir do body com senha alterada
      const dadosUsuario = {
        nome: dados.nome,
        email: dados.email,
        senha: senhaHash,
        role: dados.role,
      };

      /* Forma alternativa usando operador spread
  const dadosUsuario = {
    ...dados,
    senha: senhaHash,
  };
  */

      await usuarioRepository.save(dadosUsuario);

      response
        .status(CREATED_SUCCESS_REQUEST)
        .send({ nome: dados.nome, role: dados.role });
    }
  },
);

export default authRoutes;
