import { Config } from './config.interface';

export interface MediaViewerConfig extends Config {
  enable: boolean;
  image: boolean;
  video: boolean;
}
