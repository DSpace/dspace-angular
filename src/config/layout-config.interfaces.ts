import { Config } from "./config.interface";

export interface LayoutConfig extends Config {
  logo: LogoLayoutConfig;
}
export interface LogoLayoutConfig{
  imageWidthConstraint: number
  imageHeightConstraint: number
}
