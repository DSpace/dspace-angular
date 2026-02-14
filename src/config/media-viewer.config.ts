import { Config } from './config';

export class MediaViewerConfig extends Config {
  @Config.public image = false;
  @Config.public video = false;
}
