import {autoserialize} from 'cerialize';

/**
 * notify service patterns
 */
export class NotifyServicePattern {
  @autoserialize
  pattern: string;
  @autoserialize
  constraint: string;
  @autoserialize
  automatic: string;
}
