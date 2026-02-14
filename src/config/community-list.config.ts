import { Config } from './config';

export class CommunityListConfig extends Config {
  @Config.public pageSize = 20;
}
