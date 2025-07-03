/**
 * The configuration of a parameter from a decorator
 */
export interface DecoratorParam {
  /**
   * The name of the parameter
   */
  name: string;

  /**
   * The default value if any of the decorator param
   */
  default?: string;

  /**
   * The property of the provided value that should be used instead to generate the Map. So, for example, if the
   * decorator value is a {@link ResourceType}, you may want to use the `ResourceType.value` instead of the whole
   * {@link ResourceType} object. In this case the {@link DecoratorParam#property} would be `value`.
   */
  property?: string;
}
