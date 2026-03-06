/**
 * The configuration for a decorator parameter.
 */
export interface DecoratorParam {
  /**
   * The name of the parameter
   */
  name: string;

  /**
   * The default value of the decorator param
   *
   * (Optional)
   */
  default?: string;

  /**
   * The property of the provided parameter value that should be used instead of the value itself.
   *
   * For example, if the parameter value is {@link ResourceType} 'BITSTREAM', you'll want to use 'BITSTREAM.value'
   * instead of the whole {@link ResourceType} object. In this case the {@link DecoratorParam#property} is `value`.
   *
   * (Optional)
   */
  property?: string;
}
