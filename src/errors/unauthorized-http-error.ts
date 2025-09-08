import { HttpStatusCode } from "../types/http-status-code";
import { HttpError } from "./http-error";

export class UnauthorizedHttpError extends HttpError {
  constructor(message?: string) {
    super(HttpStatusCode.UNAUTHORIZED, message);
  }
}
