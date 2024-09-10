import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export abstract class DatadogRumService {

  /**
   * Initializes the service
   */
  abstract initDatadogRum();
}

