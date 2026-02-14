import { Config } from './config';

/**
 * Config that determines the spring Actuators options
 */
export class ActuatorsConfig extends Config {
  /**
   * The endpoint path
   */
  @Config.publish() endpointPath: string;
}
