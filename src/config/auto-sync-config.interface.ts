import { RestRequestMethod } from '../app/core/data/request.models';

/* enum indices  */
type TimePerMethod = {
  [method in RestRequestMethod]: number;
};

export interface AutoSyncConfig {
  defaultTime: number;
  timePerMethod: TimePerMethod;
  maxBufferSize: number;
};
