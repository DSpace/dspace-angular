import { Config } from './config.interface';
import { DefaultPrivacyLevel } from '@datadog/browser-rum';

export interface DatadogRumConfig extends Config {
  clientToken: string;
  applicationId: string;
  site?: string;
  service: string;
  env: string;
  sessionSampleRate?: number;
  sessionReplaySampleRate?: number;
  trackUserInteractions?: boolean;
  trackResources?: boolean;
  trackLongTasks?: boolean;
  defaultPrivacyLevel?: DefaultPrivacyLevel;
}
