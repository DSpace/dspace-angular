import { Config } from './config.interface';


export interface AddThisPluginConfig extends Config {
  siteId: string;
  scriptUrl: string;
  socialNetworksEnabled: boolean;
}
