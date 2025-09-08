import { HttpStatusCode } from "../types/http-status-code";
import { HttpError } from "./http-error";

export class BadRequestHttpError extends HttpError {
  constructor(message?: string) {
    super(HttpStatusCode.BAD_REQUEST, message);
  }
}
