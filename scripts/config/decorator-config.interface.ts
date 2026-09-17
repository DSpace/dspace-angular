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

  /**
   * When true, the generated registry stores direct class references via static imports
   * instead of lazy `() => import(...).then(...)` factories. Lookups can then be synchronous.
   *
   * Prefer this for small model/class maps. Leave unset (lazy) for large Angular components
   * or services where code-splitting matters.
   *
   * Important: with synchronous registries, keep the decorator marker in a module that does
   * **not** import the registry. Put the getter in a separate module that imports the registry.
   * Otherwise the registry's static imports of decorated classes create a circular dependency
   * (registry → decorated class → decorator → registry).
   *
   * (Optional, defaults to false)
   */
  synchronous?: boolean;
}
