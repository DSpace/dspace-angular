import { Injectable } from '@angular/core';

@Injectable()
export abstract class DatadogRumService {

  /**
   * Initializes the service
   */
  abstract initDatadogRum();
}

