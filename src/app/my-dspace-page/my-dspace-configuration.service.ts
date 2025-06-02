import {
  Inject,
  Injectable,
  InjectionToken,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  combineLatest,
  Observable,
} from 'rxjs';
import {
  first,
  map,
} from 'rxjs/operators';

import {
  APP_CONFIG,
  AppConfig,
} from '../../config/app-config.interface';
import { LinkService } from '../core/cache/builders/link.service';
import { RemoteDataBuildService } from '../core/cache/builders/remote-data-build.service';
import {
  SortDirection,
  SortOptions,
} from '../core/cache/models/sort-options.model';
import { RequestService } from '../core/data/request.service';
import { PaginationService } from '../core/pagination/pagination.service';
import { RoleService } from '../core/roles/role.service';
import { RouteService } from '../core/services/route.service';
import { Context } from '../core/shared/context.model';
import { HALEndpointService } from '../core/shared/hal-endpoint.service';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { SearchConfigurationOption } from '../shared/search/search-switch-configuration/search-configuration-option.model';
import { MyDSpaceConfigurationValueType } from './my-dspace-configuration-value-type';

export const MyDSpaceConfigurationToContextMap = new Map([
  [MyDSpaceConfigurationValueType.Workspace, Context.Workspace],
  [MyDSpaceConfigurationValueType.SupervisedItems, Context.SupervisedItems],
  [MyDSpaceConfigurationValueType.Workflow, Context.Workflow],
]);

export const SEARCH_CONFIG_SERVICE: InjectionToken<SearchConfigurationService> = new InjectionToken<SearchConfigurationService>('searchConfigurationService');

/**
 * Service that performs all actions that have to do with the current mydspace configuration
 */
@Injectable({ providedIn: 'root' })
export class MyDSpaceConfigurationService extends SearchConfigurationService {
  /**
   * Default pagination settings
   */
  protected defaultPagination = Object.assign(new PaginationComponentOptions(), {
    id: 'mydspace-page',
    pageSize: 10,
    currentPage: 1,
  });

  /**
   * Default sort settings
   */
  protected defaultSort = new SortOptions('dc.date.issued', SortDirection.DESC);

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

  constructor(protected roleService: RoleService,
              protected routeService: RouteService,
              protected paginationService: PaginationService,
              protected route: ActivatedRoute,
              protected linkService: LinkService,
              protected halService: HALEndpointService,
              protected requestService: RequestService,
              protected rdb: RemoteDataBuildService,
              @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    super(
      routeService,
      paginationService,
      route,
      linkService,
      halService,
      requestService,
      rdb,
      appConfig,
    );

    // override parent class initialization
    this._defaults = null;
    this.initDefaults();

    this.isSubmitter$ = this.roleService.isSubmitter();
    this.isController$ = this.roleService.isController();
    this.isAdmin$ = this.roleService.isAdmin();
  }

  /**
   * Returns the list of available configuration depend on the user role
   *
   * @return {Observable<MyDSpaceConfigurationValueType[]>}
   *    Emits the available configuration list
   */
  public getAvailableConfigurationTypes(): Observable<MyDSpaceConfigurationValueType[]> {
    return combineLatest(this.isSubmitter$, this.isController$, this.isAdmin$).pipe(
      first(),
      map(([isSubmitter, isController, isAdmin]: [boolean, boolean, boolean]) => {
        const availableConf: MyDSpaceConfigurationValueType[] = [];
        if (isSubmitter) {
          availableConf.push(MyDSpaceConfigurationValueType.Workspace);
        }
        if (isController || isAdmin) {
          availableConf.push(MyDSpaceConfigurationValueType.SupervisedItems);
          availableConf.push(MyDSpaceConfigurationValueType.Workflow);
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
      map((availableConfigurationTypes: MyDSpaceConfigurationValueType[]) => {
        const configurationOptions: SearchConfigurationOption[] = [];
        availableConfigurationTypes.forEach((type) => {
          const value = type;
          const label = `mydspace.show.${value}`;
          const context = MyDSpaceConfigurationToContextMap.get(type);
          configurationOptions.push({ value, label, context });
        });
        return configurationOptions;
      }),
    );
  }

}
