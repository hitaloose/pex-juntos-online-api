import { HttpStatusCode } from "../types/http-status-code";
import { HttpError } from "./http-error";

export class UnprocessableEntityHttpError extends HttpError {
  constructor(message?: string) {
    super(HttpStatusCode.UNPROCESSABLE_ENTITY, message);
  }
}
