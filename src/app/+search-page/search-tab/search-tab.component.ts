import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { RolesService } from '../../core/roles/roles.service';
import { isEmpty } from '../../shared/empty.util';
import { MyDSpaceConfigurationType } from '../../+my-dspace-page/mydspace-configuration-type';

@Component({
  selector: 'ds-search-tab',
  styleUrls: ['./search-tab.component.scss'],
  templateUrl: './search-tab.component.html',
})
export class SearchTabComponent implements OnInit {

  public tabOptions = [];
  public selectedOption: MyDSpaceConfigurationType;

  constructor(private rolesService: RolesService, private router: Router) {
  }

  ngOnInit() {

    Object.keys(MyDSpaceConfigurationType)
      .forEach((key) => {
        const label = `mydspace.show.${MyDSpaceConfigurationType[key]}`;
        if (MyDSpaceConfigurationType[key] === MyDSpaceConfigurationType.Workspace && this.rolesService.isSubmitter()) {
          this.tabOptions.push({value: MyDSpaceConfigurationType[key], label});
          this.selectedOption = MyDSpaceConfigurationType.Workspace;
        }
        if (MyDSpaceConfigurationType[key] === MyDSpaceConfigurationType.Workflow && this.rolesService.isController()) {
          this.tabOptions.push({value: MyDSpaceConfigurationType[key], label});
          if (isEmpty(this.selectedOption)) {
            this.selectedOption = MyDSpaceConfigurationType.Workflow;
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

  compare(item1: MyDSpaceConfigurationType, item2: MyDSpaceConfigurationType) {
    return item1 === item2;
  }
}
