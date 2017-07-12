import { Injectable } from '@angular/core';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { DataLoader } from './data-loader';

@Injectable()
export class BrowserDataLoader extends DataLoader {

  protected prefix: string;

  protected suffix: string;

  constructor(private http: Http) {
    super();
    this.prefix = 'assets/data';
    this.suffix = '.json';
  }

  public getData(name: string): Observable<any> {
    return this.http.get(`${this.prefix}/${this.language}/${name}${this.suffix}`, {}).map((response: Response) => {
      return response.json();
    });
  }

}
