import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { hasValue } from '../../shared/empty.util';
import { MYDSPACE_ROUTE, SEARCH_CONFIG_SERVICE } from '../../+my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../search-service/search-configuration.service';
import { MyDSpaceConfigurationValueType } from '../../+my-dspace-page/my-dspace-configuration-value-type';
import { SearchConfigurationOption } from './search-configuration-option.model';

@Component({
  selector: 'ds-search-switch-configuration',
  styleUrls: ['./search-switch-configuration.component.scss'],
  templateUrl: './search-switch-configuration.component.html',
})
export class SearchSwitchConfigurationComponent implements OnDestroy, OnInit {

  /**
   * The list of available configuration options
   */
  @Input() configurationList: SearchConfigurationOption[] = [];

  public selectedOption: string;

  private sub: Subscription;

  constructor(private router: Router,
              @Inject(SEARCH_CONFIG_SERVICE) private searchConfigService: SearchConfigurationService) {
  }

  ngOnInit() {
    this.searchConfigService.getCurrentConfiguration('default')
      .subscribe((currentConfiguration) => this.selectedOption = currentConfiguration);
  }

  onSelect(event: Event) {
    const navigationExtras: NavigationExtras = {
      queryParams: {configuration: this.selectedOption},
    };

    this.router.navigate([MYDSPACE_ROUTE], navigationExtras);
  }

  compare(item1: MyDSpaceConfigurationValueType, item2: MyDSpaceConfigurationValueType) {
    return item1 === item2;
  }

  ngOnDestroy() {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
