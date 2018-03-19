import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { RolesService } from '../../core/roles/roles.service';
import { hasValue, isEmpty, isNotEmpty, isUndefined } from '../../shared/empty.util';
import { MyDSpaceConfigurationType } from '../../+my-dspace-page/mydspace-configuration-type';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ds-search-tab',
  styleUrls: ['./search-tab.component.scss'],
  templateUrl: './search-tab.component.html',
})
export class SearchTabComponent implements OnDestroy, OnInit {

  public tabOptions = [];
  public selectedOption: MyDSpaceConfigurationType;

  private sub: Subscription;

  constructor(private rolesService: RolesService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    const queryParamsObs = this.route.queryParams;
    this.sub = Observable.combineLatest(queryParamsObs, this.rolesService.isSubmitter(), this.rolesService.isController())
      .subscribe(([params, isSubmitter, isController]) => {
        this.tabOptions = [];
        let isCleaningUrl = false;
        const paramConfiguration = params.configuration;
        const availableConf: MyDSpaceConfigurationType[] = this.getAvailableConfiguration(isSubmitter, isController);
        const isAllowed = (isEmpty(paramConfiguration) || availableConf.includes(paramConfiguration));
        availableConf
          .forEach((conf) => {
            if (!isCleaningUrl) {
              const label = `mydspace.show.${conf}`;
              this.tabOptions.push({value: conf, label});
              if (!isAllowed) {
                isCleaningUrl = true;
              } else if (isNotEmpty(paramConfiguration) && isEmpty(this.selectedOption)) {
                this.selectedOption = paramConfiguration;
              } else if (isEmpty(paramConfiguration) && isEmpty(this.selectedOption)) {
                this.selectedOption = conf;
              }
            }
            // if ((isUndefined(paramConfiguration) || paramConfiguration === MyDSpaceConfigurationType.Workspace) && isSubmitter) {
            //   this.tabOptions.push({value: MyDSpaceConfigurationType[key], label});
            //   this.selectedOption = MyDSpaceConfigurationType.Workspace;
            // }
            // if ((isUndefined(paramConfiguration) || paramConfiguration === MyDSpaceConfigurationType.Workflow) && isController) {
            //   this.tabOptions.push({value: MyDSpaceConfigurationType[key], label});
            //   if (isEmpty(this.selectedOption)) {
            //     this.selectedOption = MyDSpaceConfigurationType.Workflow;
            //   }
            // }
          });
      })

  }

  private getAvailableConfiguration(isSubmitter: boolean, isController: boolean): MyDSpaceConfigurationType[] {
    const availableConf: MyDSpaceConfigurationType[] = [];
    if (isSubmitter || (!isSubmitter && !isController)) {
      availableConf.push(MyDSpaceConfigurationType.Workspace);
    }
    if (isController || (!isSubmitter && !isController)) {
      availableConf.push(MyDSpaceConfigurationType.Workflow);
    }
    return availableConf;
  }

  cleanUrl(configuration: MyDSpaceConfigurationType) {
    const navigationExtras: NavigationExtras = {
      queryParams: {configuration: configuration},
      queryParamsHandling: 'merge'
    };

    this.router.navigate(['/mydspace'], navigationExtras);
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
