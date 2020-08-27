import { Config } from './config.interface';

export interface URN extends Config {
  name: string;
  baseUrl: string;
}
