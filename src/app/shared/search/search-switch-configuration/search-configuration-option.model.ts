/**
 * Represents a search configuration select option
 */
import { Context } from '../../../../../modules/core/src/lib/core/shared/context.model';

export interface SearchConfigurationOption {

  /**
   * The select option value
   */
  value: string;

  /**
   * The select option label
   */
  label: string;

  /**
   * The search context to use with the configuration
   */
  context: Context;
}
