import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { CrisLayoutBox } from '../../../decorators/cris-layout-box.decorator';
import { LayoutPage } from '../../../enums/layout-page.enum';
import { LayoutTab } from '../../../enums/layout-tab.enum';
import { LayoutBox } from '../../../enums/layout-box.enum';
import { CrisLayoutBoxModelComponent as CrisLayoutBoxObj } from '../../../models/cris-layout-box.model';
import { Observable, Subscription } from 'rxjs';
import { hasValue } from '../../../../shared/empty.util';
import { getFirstSucceededRemoteDataPayload } from '../../../../core/shared/operators';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

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

  /**
   * Variable to understand if the next box clear value
   */
  nextBoxClear = true;

  /**
   * Dynamic styling of the component host selector
   */
  @HostBinding('style.flex') flex = '1';

  /**
   * Dynamic styling of the component host selector
   */
  @HostBinding('style.marginRight') margin = '0px';


  constructor(public cd: ChangeDetectorRef, protected translateService: TranslateService) {
    super(translateService);
  }

  ngOnInit(): void {
    super.ngOnInit();

    if (this.box.clear) {
      this.flex = '0 0 100%';
    }

    if (!this.box.clear && !this.nextBoxClear) {
      this.margin = '10px';
    }

    this.searchFilter = `scope=${this.item.id}`;
    this.configuration$ = this.box.configuration.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((config) => config.configuration)
    );
    this.subs.push(this.configuration$.subscribe((next) => {
      this.configuration = next;
      this.configReady = true;
      this.cd.markForCheck();
    }));
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
