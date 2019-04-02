import { Router } from '@angular/router';
import { Injector, Input } from '@angular/core';

import { find } from 'rxjs/operators';

import { MydspaceActionsServiceFactory } from './mydspace-actions-service.factory';
import { RemoteData } from '../../core/data/remote-data';
import { DataService } from '../../core/data/data.service';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { ResourceType } from '../../core/shared/resource-type';
import { NotificationOptions } from '../notifications/models/notification-options.model';
import { NotificationsService } from '../notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * Abstract class for all different representations of mydspace actions
 */
export abstract class MyDSpaceActionsComponent<T extends DSpaceObject, TService extends DataService<T>> {

  /**
   * The target mydspace object
   */
  @Input() abstract object: T;

  /**
   * Instance of DataService realted to mydspace object
   */
  protected objectDataService: TService;

  /**
   * Initialize instance variables
   *
   * @param {ResourceType} objectType
   * @param {Injector} injector
   * @param {Router} router
   * @param {NotificationsService} notificationsService
   * @param {TranslateService} translate
   */
  constructor(
    protected objectType: ResourceType,
    protected injector: Injector,
    protected router: Router,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService) {
    const factory = new MydspaceActionsServiceFactory<T, TService>();
    this.objectDataService = injector.get(factory.getConstructor(objectType));
  }

  /**
   * Abstract method called to init the target object
   *
   * @param {T} object
   */
  abstract initObjects(object: T): void;

  /**
   * Refresh current page
   */
  reload(): void {
    // override the route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    this.router.navigated = false;
    const url = decodeURIComponent(this.router.url);
    this.router.navigateByUrl(url);
  }

  /**
   * Override the target object with a refreshed one
   */
  refresh(): void {
    // find object by id
    this.objectDataService.findById(this.object.id).pipe(
      find((rd: RemoteData<T>) => rd.hasSucceeded)
    ).subscribe((rd: RemoteData<T>) => {
      this.initObjects(rd.payload as T);
    });
  }

  /**
   * Handle action response and show properly notification
   *
   * @param result
   *    true on success, false otherwise
   */
  handleActionResponse(result: boolean): void {
    if (result) {
      this.reload();
      this.notificationsService.success(null,
        this.translate.get('submission.workflow.tasks.generic.success'),
        new NotificationOptions(5000, false));
    } else {
      this.notificationsService.error(null,
        this.translate.get('submission.workflow.tasks.generic.error'),
        new NotificationOptions(20000, true));
    }
  }
}
