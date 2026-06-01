import { HttpStatusCode } from '../types/http-status-code.js';
import { HttpError } from './http-error.js';

export class ForbiddenHttpError extends HttpError {
  constructor(message?: string) {
    super(HttpStatusCode.FORBIDDEN, message);
  }
}
