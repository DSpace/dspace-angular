import { Injectable } from '@angular/core';
import { ItemDataService } from '../data/item-data.service';
import {QABreadcrumbsService} from "./qa-breadcrumbs.service";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {BreadcrumbConfig} from "../../breadcrumbs/breadcrumb/breadcrumb-config.model";
import {currentPathFromSnapshot} from "../../shared/utils/route.utils";

@Injectable({
  providedIn: 'root'
})
export class QABreadcrumbResolver implements Resolve<BreadcrumbConfig<string>>  {
  constructor(protected breadcrumbService: QABreadcrumbsService,  protected dataService: ItemDataService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BreadcrumbConfig<string> {
    const key = "testKey";
    const fullPath = currentPathFromSnapshot(route);
    console.log(key, fullPath)
    return { provider: this.breadcrumbService, key: key, url: fullPath };
  }
}
