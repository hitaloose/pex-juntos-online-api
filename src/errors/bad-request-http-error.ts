import { HttpStatusCode } from '../types/http-status-code.js';
import { HttpError } from './http-error.js';

export class BadRequestHttpError extends HttpError {
  constructor(message?: string) {
    super(HttpStatusCode.BAD_REQUEST, message);
  }
}
