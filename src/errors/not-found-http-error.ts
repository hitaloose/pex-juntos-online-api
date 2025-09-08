import { HttpStatusCode } from "../types/http-status-code";
import { HttpError } from "./http-error";

export class NotFoundHttpError extends HttpError {
  constructor(message?: string) {
    super(HttpStatusCode.NOT_FOUND, message);
  }
}
