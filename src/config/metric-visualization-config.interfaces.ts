import { Config } from './config.interface';

export interface MetricVisualizationConfig extends Config {
  type: string;
  icon: string;
  class: string;
  plumXConfig?: PlumXConfig;
}

export interface PlumXConfig {
  hideName: boolean;
  hideDescription: boolean;
  hideThumbnail: boolean;
  hideStatus: boolean;
  hideArtifacts: boolean;
  artifactsNumber: number;
  language: string;
  width: string;
  placeholder: string;
}
