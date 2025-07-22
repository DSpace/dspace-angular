import {
  HALLink,
  UnCacheableObject,
} from '../shared';

/**
 * The response substate in the NgRx store
 */
export class ResponseState {
  timeCompleted: number;
  statusCode: number;
  errorMessage?: string;
  payloadLink?: HALLink;
  unCacheableObject?: UnCacheableObject;
}
