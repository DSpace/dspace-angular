/**
 * ThirdPartyMetric represents the configuration for a third-party metric, including its key and whether it is enabled or not.
 */
export interface ThirdPartyMetric {
  /** Metric name **/
  key: string;
  /** Whether is enabled or not **/
  enabled: boolean
}
