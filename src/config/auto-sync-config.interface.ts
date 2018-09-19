import { RestRequestMethod } from '../app/core/data/rest-request-method';

type TimePerMethod = {
  [method in RestRequestMethod]: number;
};

export interface AutoSyncConfig {
  defaultTime: number;
  timePerMethod: TimePerMethod;
  maxBufferSize: number;
};
