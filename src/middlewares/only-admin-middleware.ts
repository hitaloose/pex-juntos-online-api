import { NextFunction, Request, Response } from 'express';
import { Role } from '../types/role.js';
import { ForbiddenHttpError } from '../errors/forbidden-http-error.js';

export const onlyAdminMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if (request.user.role !== Role.ADMIN) {
    throw new ForbiddenHttpError(
      'Usuário deve ser administrador para acessar o recurso'
    );
  }

  next();
};
