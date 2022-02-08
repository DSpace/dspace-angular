import { Config } from './config.interface';

export interface MetricVisualizationConfig extends Config {
  type: string;
  icon: string;
  class: string;
}
