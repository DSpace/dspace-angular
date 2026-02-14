import { Config } from './config';

export class MediaViewerConfig extends Config {
  @Config.publish() image: boolean;
  @Config.publish() video: boolean;
}
