import { Config } from './config.interface';

/**
 * Represent logging in the configuration.
 */

export interface LoggingConfig extends Config {
    request?: {
        format?: string;
        immediate?: boolean;
    }
    main?: {
        level?: string;
        maxFiles?: number;
    }
}
