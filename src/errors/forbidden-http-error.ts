import { HttpStatusCode } from "../types/http-status-code";
import { HttpError } from "./http-error";

export class ForbiddenHttpError extends HttpError {
  constructor(message?: string) {
    super(HttpStatusCode.FORBIDDEN, message);
  }
}
