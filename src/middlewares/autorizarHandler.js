// funcao de alta ordem
export const autorizarHandler =
  (...rolesPermitidas) =>
  (request, response, next) => {
    console.log(rolesPermitidas);
    if (!request.usuario || !rolesPermitidas.includes(request.usuario.role)) {
      return response
        .status(403)
        .send({ error: "Você não tem permissão para acessar este recurso" });
    }

    next();
  };
