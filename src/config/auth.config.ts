import { Config } from './config';

export interface AuthTarget {
  host: string;
  page: string;
}

export class AuthConfig extends Config {
  @Config.public target: AuthTarget = undefined;

  @Config.public ui: {
    // The amount of time before the idle warning is shown
    timeUntilIdle: number;
    // The amount of time the user has to react after the idle warning is shown before they are logged out.
    idleGracePeriod: number;
  } = {
      // the amount of time before the idle warning is shown
      timeUntilIdle: 15 * 60 * 1000, // 15 minutes
      // the amount of time the user has to react after the idle warning is shown before they are logged out.
      idleGracePeriod: 5 * 60 * 1000, // 5 minutes
    };

  @Config.public rest: {
    // If the rest token expires in less than this amount of time, it will be refreshed automatically.
    // This is independent from the idle warning.
    timeLeftBeforeTokenRefresh: number;
  } = {
      // If the rest token expires in less than this amount of time, it will be refreshed automatically.
      // This is independent from the idle warning.
      timeLeftBeforeTokenRefresh: 2 * 60 * 1000, // 2 minutes
    };
}
