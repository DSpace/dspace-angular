import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import * as fs from 'fs';

import { DataLoader } from './data-loader';

@Injectable()
export class ServerDataLoader extends DataLoader {

  protected prefix: string;

  protected suffix: string;

  constructor() {
    super();
    this.prefix = 'dist/assets/data';
    this.suffix = '.json';
  }

  public getData(name: string): Observable<any> {
    return Observable.create((observer: any) => {
      observer.next(JSON.parse(fs.readFileSync(`${this.prefix}/${this.language}/${name}${this.suffix}`, 'utf8')));
      observer.complete();
    });
  }

}
