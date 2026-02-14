import { Config } from './config';

export class CommunityListConfig extends Config {
  @Config.publish() pageSize: number;
}
