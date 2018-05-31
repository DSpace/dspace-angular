import { Router } from '@angular/router';
import { Injector, Input } from '@angular/core';

import { MydspaceActionsServiceFactory } from './mydspace-actions-service.factory';
import { RemoteData } from '../../core/data/remote-data';
import { NormalizedObject } from '../../core/cache/models/normalized-object.model';
import { DataService } from '../../core/data/data.service';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { ResourceType } from '../../core/shared/resource-type';

export abstract class MyDSpaceActionsComponent<T extends DSpaceObject, TNormalized extends NormalizedObject, TService extends DataService<TNormalized, T>> {
  @Input() abstract object: T;
  protected objectDataService: TService;

  constructor(protected objectType: ResourceType, protected injector: Injector, protected router: Router) {
    const factory = new MydspaceActionsServiceFactory<T, TNormalized, TService>();
    this.objectDataService = injector.get(factory.getConstructor(objectType));
  }

  abstract initObjects(object: T): void;

  reload() {
    // override the route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    this.router.navigated = false;
    const url = decodeURIComponent(this.router.url);
    this.router.navigateByUrl(url);
  }

  refresh() {
    // override the object with a refreshed one
    this.objectDataService.findById(this.object.id)
      .filter((rd: RemoteData<T>) => rd.hasSucceeded)
      .take(1)
      .subscribe((rd: RemoteData<T>) => {
        this.initObjects(rd.payload as T);
      });
  }
}
