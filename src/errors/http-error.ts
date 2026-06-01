import { HttpStatusCode } from '../types/http-status-code.js';

export class HttpError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    message?: string
  ) {
    super(message);
  }
}
