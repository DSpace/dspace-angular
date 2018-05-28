import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { hasValue } from '../../../shared/empty.util';
import { MyDSpaceConfigurationType } from '../../../+my-dspace-page/mydspace-configuration-type';
import { Subscription } from 'rxjs/Subscription';
import { SearchConfigOption } from './search-config-option.model';
import { SearchFilterService } from '../search-filter/search-filter.service';

@Component({
  selector: 'ds-search-switch-config',
  styleUrls: ['./search-switch-config.component.scss'],
  templateUrl: './search-switch-config.component.html',
})
export class SearchSwitchConfigComponent implements OnDestroy, OnInit {
  @Input() configurationList: SearchConfigOption[] = [];

  public selectedOption: string;

  private sub: Subscription;

  constructor(private filterService: SearchFilterService,
              private router: Router) {
  }

  ngOnInit() {
    this.filterService.getCurrentConfiguration()
      .subscribe((currentConfiguration) => this.selectedOption = currentConfiguration);
  }

  onSelect(event: Event) {
    const navigationExtras: NavigationExtras = {
      queryParams: {configuration: this.selectedOption}
    };

    this.router.navigate(['/mydspace'], navigationExtras);
  }

  compare(item1: MyDSpaceConfigurationType, item2: MyDSpaceConfigurationType) {
    return item1 === item2;
  }

  ngOnDestroy() {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
