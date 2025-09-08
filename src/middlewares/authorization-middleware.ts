import { NextFunction, Request, Response } from "express";
import { BadRequestHttpError } from "../errors/bad-request-http-error";
import { UnauthorizedHttpError } from "../errors/unauthorized-http-error";
import { decode } from "../utils/jwt";
import { User } from "../models/user";

const decodeToken = (token: string): number => {
  try {
    const userId = decode(token);
    return userId;
  } catch (error) {
    throw new UnauthorizedHttpError("Token inválido");
  }
};

export const authorizationMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authorization = request.headers.authorization;

  if (!authorization) {
    throw new BadRequestHttpError("Cabeçalho de autorização não fornecido");
  }

  const [prefix, token] = authorization.split(" ");

  if (!prefix || !token) {
    throw new UnauthorizedHttpError("Cabeçalho de autorização inválido");
  }

  if (prefix.toLowerCase() !== "bearer") {
    throw new UnauthorizedHttpError(
      "Prefixo do cabeçalho de autorização inválido"
    );
  }

  const userId = decodeToken(token);

  const user = await User.findOne({ where: { id: userId } });
  if (!user) {
    throw new UnauthorizedHttpError(
      "Usuário do cabeçalho de autorização inválido"
    );
  }

  request.userId = userId;
  request.user = user;

  next();
};
