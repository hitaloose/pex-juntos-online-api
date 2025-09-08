import { NextFunction, Request, Response } from "express";
import { BadRequestHttpError } from "../errors/bad-request-http-error";
import { UnauthorizedHttpError } from "../errors/unauthorized-http-error";
import { decode } from "../utils/jwt";
import { User } from "../models/user";
import { Role } from "../types/role";
import { ForbiddenHttpError } from "../errors/forbidden-http-error";

export const onlyAdminMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (request.user.role !== Role.ADMIN) {
    throw new ForbiddenHttpError(
      "Usuário deve ser administrador para acessar o recurso"
    );
  }

  next();
};
