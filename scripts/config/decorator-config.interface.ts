import { DecoratorParam } from './decorator-param.interface';

/**
 * The configuration for a dynamic component decorator. This is used to generate the registry files.
 */
export interface DecoratorConfig {
  /**
   * Name of the decorator
   */
  name: string;

  /**
   * List of DecoratorParams
   */
  params: DecoratorParam[];
}
