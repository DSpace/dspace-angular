import { Injectable } from '@angular/core';

/* tslint:disable:no-empty */
@Injectable()
export class Angulartics2Mock {
  public eventTrack = {
    next: (param: any): void => {}
  };
}
