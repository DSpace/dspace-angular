import { DecoratorParam } from './decorator-param.interface';

/**
 * The configuration of dynamic component decorators. This is used to generate the registry files.
 */
export interface DecoratorConfig {
  name: string;
  params: DecoratorParam[];
}
