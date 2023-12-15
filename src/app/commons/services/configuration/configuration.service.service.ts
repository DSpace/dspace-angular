import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as _ from 'lodash';
import { interval, Observable } from 'rxjs';
import { filter, take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private config: Object = {
    key: 'value',
  };

  private loaded = false;

  constructor(protected httpClient: HttpClient) {
    httpClient
      .get<Response>('assets/config.json')
      .toPromise()
      .then(
        config => {
          this.config = _.merge(this.config, config);
          this.loaded = true;
        },
        err => console.log(err),
      );
  }

  public getConfigurationValue(key: string): Observable<any> {
    return interval(100)
      .pipe(
        filter(value => {
          return this.loaded;
        }),
      )
      .pipe(take(1))
      .pipe(map(value => {
        const out = this.config[key];
        return out;
      }));
  }
}
