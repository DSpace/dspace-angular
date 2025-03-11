import { Config } from './config.interface';


export interface AddToAnyPluginConfig extends Config {
  scriptUrl: string;
  socialNetworksEnabled: boolean;
  title: string;
  buttons: string[];
  showPlusButton: boolean;
  showCounters: boolean;
}
