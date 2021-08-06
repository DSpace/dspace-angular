import { Config } from './config.interface';

export interface MetadataSecurityConfig extends Config {
  levels: LevelSecurityConfig[];
}

export interface LevelSecurityConfig extends Config {
  value: number;
  icon: string;
  color: string;
}
