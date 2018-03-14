import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { RolesService } from '../../core/roles/roles.service';
import { isEmpty } from '../../shared/empty.util';

export enum SearchTabOptions {
  Workspace = 'workspace',
  Workflow = 'workflow'
}

@Component({
  selector: 'ds-search-tab',
  styleUrls: ['./search-tab.component.scss'],
  templateUrl: './search-tab.component.html',
})
export class SearchTabComponent implements OnInit {

  public tabOptions = [];
  public selectedOption: SearchTabOptions;

  constructor(private rolesService: RolesService, private router: Router) {
  }

  ngOnInit() {

    Object.keys(SearchTabOptions)
      // .filter((key) => !isNaN(Number(SearchTabOptions[key])))
      .forEach((key) => {
        const label = `mydspace.show.${SearchTabOptions[key]}`;
        // if (SearchTabOptions[key] === SearchTabOptions.Workspace && this.rolesService.isSubmitter()) {
        if (SearchTabOptions[key] === SearchTabOptions.Workspace && true) {
          this.tabOptions.push({value: SearchTabOptions[key], label});
          this.selectedOption = SearchTabOptions.Workspace;
        }
        // if (SearchTabOptions[key] === SearchTabOptions.Workflow && this.rolesService.isController()) {
        if (SearchTabOptions[key] === SearchTabOptions.Workflow && true) {
          this.tabOptions.push({value: SearchTabOptions[key], label});
          if (isEmpty(this.selectedOption)) {
            this.selectedOption = SearchTabOptions.Workflow;
          }
        }
      });
  }

  onSelect(event: Event) {
    const navigationExtras: NavigationExtras = {
      queryParams: {configuration: this.selectedOption},
      queryParamsHandling: 'merge'
    };

    this.router.navigate(['/mydspace'], navigationExtras);
  }

  compare(item1: SearchTabOptions, item2: SearchTabOptions) {
    return item1 === item2;
  }
}
