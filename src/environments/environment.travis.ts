import { GlobalConfig } from '../config/global-config.interface';

export const environment: Partial<GlobalConfig> = {
    rest: {
        ssl: false,
        host: 'localhost',
        port: 8080,
        // NOTE: Space is capitalized because 'namespace' is a reserved string in TypeScript
        nameSpace: '/server/api'
    }
};
