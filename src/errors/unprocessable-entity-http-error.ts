import { HttpStatusCode } from '../types/http-status-code.js';
import { HttpError } from './http-error.js';

export class UnprocessableEntityHttpError extends HttpError {
  constructor(message?: string) {
    super(HttpStatusCode.UNPROCESSABLE_ENTITY, message);
  }
}
