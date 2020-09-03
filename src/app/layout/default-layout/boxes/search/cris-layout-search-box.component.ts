import { Component, OnInit, OnDestroy } from '@angular/core';
import { CrisLayoutBox } from 'src/app/layout/decorators/cris-layout-box.decorator';
import { LayoutPage } from 'src/app/layout/enums/layout-page.enum';
import { LayoutTab } from 'src/app/layout/enums/layout-tab.enum';
import { LayoutBox } from 'src/app/layout/enums/layout-box.enum';
import { CrisLayoutBox as CrisLayoutBoxObj } from 'src/app/layout/models/cris-layout-box.model';
import { Observable, of, Subscription } from 'rxjs';
import { isNotEmpty, hasValue } from 'src/app/shared/empty.util';
import { getAllSucceededRemoteDataPayload } from 'src/app/core/shared/operators';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ds-cris-layout-search-box',
  templateUrl: './cris-layout-search-box.component.html',
  styleUrls: ['./cris-layout-search-box.component.scss']
})
@CrisLayoutBox(LayoutPage.DEFAULT, LayoutTab.DEFAULT, LayoutBox.RELATION)
export class CrisLayoutSearchBoxComponent extends CrisLayoutBoxObj implements OnInit, OnDestroy {

  /**
   * Filter used for set scope in discovery invocation
   */
  searchFilter: string;
  /**
   * Name of configuration for this box
   */
  configuration: string;
  configuration$: Observable<string>;
  /**
   * flag for enable/disable search bar
   */
  searchEnabled = false;
  sideBarWidth = 1;
  configReady = false;
  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  constructor() {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.configuration$ = this.box.configuration.pipe(
      getAllSucceededRemoteDataPayload(),
      map((config) => config.configuration)
    );
    this.subs.push(this.configuration$.subscribe((next) => {
      this.configuration = next;
      this.configReady = true;
    }));
    this.searchFilter = `scope=${this.item.id}`;
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
