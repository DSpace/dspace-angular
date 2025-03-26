import { Injectable } from '@angular/core';
import { DatadogRumService } from './datadog-rum.service';

@Injectable()
export class ServerDatadogRumService extends DatadogRumService {

  initDatadogRum() {
    return;
  }
}

