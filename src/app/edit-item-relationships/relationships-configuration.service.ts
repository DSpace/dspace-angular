import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { RelationshipsConfigurationValueType } from './relationships-configuration-value-type';
import { RoleService } from '../core/roles/role.service';
import { SearchConfigurationOption } from '../shared/search/search-switch-configuration/search-configuration-option.model';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { RouteService } from '../core/services/route.service';
import { PaginationService } from '../core/pagination/pagination.service';

/**
 * Service that performs all actions that have to do with the current mydspace configuration
 */
@Injectable()
export class RelationshipsConfigurationService extends SearchConfigurationService {
  /**
   * Default pagination settings
   */
  protected defaultPagination = Object.assign(new PaginationComponentOptions(), {
    id: 'edit-item-relationships-page',
    pageSize: 10,
    currentPage: 1
  });

  /**
   * Default sort settings
   */
  // protected defaultSort = new SortOptions('dc.title', SortDirection.DESC);

  /**
   * Default configuration parameter setting
   */
  protected defaultConfiguration = 'workspace';

  /**
   * Default scope setting
   */
  protected defaultScope = '';

  /**
   * Default query setting
   */
  protected defaultQuery = '';

  private isAdmin$: Observable<boolean>;
  private isController$: Observable<boolean>;
  private isSubmitter$: Observable<boolean>;

  /**
   * Initialize class
   *
   * @param {roleService} roleService
   * @param {RouteService} routeService
   * @param {ActivatedRoute} route
   */
  constructor(protected roleService: RoleService,
              protected routeService: RouteService,
              protected paginationService: PaginationService,
              protected route: ActivatedRoute) {

    super(routeService, paginationService, route);

    // override parent class initialization
    this._defaults = null;
    this.initDefaults();

    this.isSubmitter$ = this.roleService.isSubmitter();
    this.isController$ = this.roleService.isController();
    this.isAdmin$ = this.roleService.isAdmin();
  }

  setOptions(config,scope?): void {
    this.defaultConfiguration = config;
    if ( !!scope ) {
      this.defaultScope = scope;
    }
    // override parent class initialization
    this._defaults = null;
    this.initDefaults();
  }

  /**
   * Returns the list of available configuration depend on the user role
   *
   * @return {Observable<RelationshipsConfigurationValueType[]>}
   *    Emits the available configuration list
   */
  public getAvailableConfigurationTypes(): Observable<RelationshipsConfigurationValueType[]> {
    return combineLatest(this.isSubmitter$, this.isController$, this.isAdmin$).pipe(
      first(),
      map(([isSubmitter, isController, isAdmin]: [boolean, boolean, boolean]) => {
        const availableConf: RelationshipsConfigurationValueType[] = [];
        if (isSubmitter) {
          availableConf.push(RelationshipsConfigurationValueType.Workspace);
        }
        if (isController || isAdmin) {
          availableConf.push(RelationshipsConfigurationValueType.Workflow);
        }
        return availableConf;
      }));
  }

  /**
   * Returns the select options for the available configuration list
   *
   * @return {Observable<SearchConfigurationOption[]>}
   *    Emits the select options list
   */
  public getAvailableConfigurationOptions(): Observable<SearchConfigurationOption[]> {
    return this.getAvailableConfigurationTypes().pipe(
      first(),
      map((availableConfigurationTypes: RelationshipsConfigurationValueType[]) => {
        const configurationOptions: SearchConfigurationOption[] = [];
        availableConfigurationTypes.forEach((type) => {
          const value = type;
          const label = `relationships.show.${value}`;
          configurationOptions.push({ value, label });
        });
        return configurationOptions;
      })
    );
  }

}
