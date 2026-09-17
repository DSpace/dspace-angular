import { PathableObjectError } from './response-state.model';

export class RequestError extends Error {
  statusCode: number;
  statusText: string;
  errors?: PathableObjectError[];
}
