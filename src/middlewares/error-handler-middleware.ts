import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/http-error";
import { ZodError } from "zod";

export const errorHandlerMiddleware = (
  error: unknown,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log(error);

  if (error instanceof ZodError) {
    response.status(400).json({
      message: "Erro no esquema de dados de entrada",
      details: error.issues,
    });
  }

  if (error instanceof HttpError) {
    response.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (error instanceof Error) {
    response.status(500).json({ message: error.message });
    return;
  }

  response.status(500).json({ message: "Erro desconhecido" });
};
