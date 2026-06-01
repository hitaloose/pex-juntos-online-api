import { HttpStatusCode } from '../types/http-status-code.js';
import { HttpError } from './http-error.js';

export class UnauthorizedHttpError extends HttpError {
  constructor(message?: string) {
    super(HttpStatusCode.UNAUTHORIZED, message);
  }
}
