import { HALLink } from '../shared/hal-link.model';
import { UnCacheableObject } from '../shared/uncacheable-object.model';

/**
 * Interface for rest error associated to a path
 */
export interface PathableObjectError {
  message: string;
  paths: string[];
}

/**
 * The response substate in the NgRx store
 */
export class ResponseState {
    timeCompleted: number;
    statusCode: number;
    errorMessage?: string;
    errors?: PathableObjectError[];
    payloadLink?: HALLink;
    unCacheableObject?: UnCacheableObject;
}
