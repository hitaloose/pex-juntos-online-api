import { HttpStatusCode } from '../types/http-status-code.js';
import { HttpError } from './http-error.js';

export class NotFoundHttpError extends HttpError {
  constructor(message?: string) {
    super(HttpStatusCode.NOT_FOUND, message);
  }
}
