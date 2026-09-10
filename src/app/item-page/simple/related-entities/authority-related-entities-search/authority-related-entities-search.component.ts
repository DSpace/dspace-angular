import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  NgbNav,
  NgbNavContent,
  NgbNavItem,
  NgbNavLink,
  NgbNavOutlet,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { ThemedSearchComponent } from '../../../../shared/search/themed-search.component';
import { TabbedRelatedEntitiesSearchComponent } from '../tabbed-related-entities-search/tabbed-related-entities-search.component';

@Component({
  selector: 'ds-authority-related-entities-search',
  templateUrl: './authority-related-entities-search.component.html',
  imports: [
    AsyncPipe,
    NgbNav,
    NgbNavContent,
    NgbNavItem,
    NgbNavLink,
    NgbNavOutlet,
    ThemedSearchComponent,
    TranslateModule,
  ],
})
/**
 * A component to show related items as search results, based on authority value
 */
export class AuthorityRelatedEntitiesSearchComponent extends TabbedRelatedEntitiesSearchComponent implements OnInit {
  /**
   * Filter used for set scope in discovery invocation
   */
  searchFilter: string;
  /**
   * Discovery configurations for search page
   */
  @Input() configurations: string[] = [];



  ngOnInit() {
    super.ngOnInit();
    this.searchFilter = `scope=${this.item.id}`;
  }
}
