import { autoserialize } from 'cerialize';

/**
 * A single notify service pattern and his properties
 */
export class NotifyServicePattern {
  @autoserialize
  pattern: string;
  @autoserialize
  constraint: string;
  @autoserialize
  automatic: string;
}
