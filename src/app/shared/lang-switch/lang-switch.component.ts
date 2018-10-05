import { Component, OnInit } from '@angular/core';
import { createSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'ds-lang-switch',
  styleUrls: ['lang-switch.component.scss'],
  templateUrl: 'lang-switch.component.html',
})
export class LangSwitchComponent implements OnInit {
  /**
   * Whether user is authenticated.
   * @type {Observable<string>}
   */
  public isAuthenticated: Observable<boolean>;
  public isNavBarCollapsed: Observable<boolean>;

  constructor(
    public translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    // set loading
  }

}
