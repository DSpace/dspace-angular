import { Inject, Injectable } from '@angular/core';
import { MetadataService } from '../metadata/metadata.service';
import { ActivatedRoute, NavigationEnd, Event as NavigationEvent, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Meta, Title } from '@angular/platform-browser';
import { DSONameService } from '../breadcrumbs/dso-name.service';
import { BundleDataService } from '../data/bundle-data.service';
import { BitstreamDataService } from '../data/bitstream-data.service';
import { BitstreamFormatDataService } from '../data/bitstream-format-data.service';
import { RootDataService } from '../data/root-data.service';
import { CoreState } from '../core-state.model';
import { Store } from '@ngrx/store';
import { HardRedirectService } from '../services/hard-redirect.service';
import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';
import { AuthorizationDataService } from '../data/feature-authorization/authorization-data.service';
import { filter, map, switchMap, take, mergeMap } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MetadataItemService extends MetadataService {

  constructor(
    private router1: ActivatedRoute,
    router: Router,
    translate: TranslateService,
    meta: Meta,
    title: Title,
    dsoNameService: DSONameService,
    bundleDataService: BundleDataService,
    bitstreamDataService: BitstreamDataService,
    bitstreamFormatDataService: BitstreamFormatDataService,
    rootService: RootDataService,
    store: Store<CoreState>,
    hardRedirectService: HardRedirectService,
    @Inject(APP_CONFIG) appConfig: AppConfig,
    authorizationService: AuthorizationDataService,
    @Inject(DOCUMENT) private document: Document
  ) { 
    super(router, translate, meta, title, dsoNameService, bundleDataService, bitstreamDataService, bitstreamFormatDataService, rootService, store, hardRedirectService, appConfig, authorizationService);
  }

  public checkCurrentRoute(){

    console.log(this.router);

    this.router1.url.subscribe(url => {
      console.log(url);
      console.log(url[0].path);
    });

    // this.router.events.subscribe((event: NavigationEvent) => {
    //   if(event instanceof NavigationStart) {
    //     if(event.url.startsWith('/entities')){
    //       console.log('We are on ENTITIES!');
    //     }
    //   }
    // });
  }

  setLinkTag(){
    this.clearMetaTags();

    let link: HTMLLinkElement = this.document.createElement('link');
    link.setAttribute('rel', '');
    link.setAttribute('href', '');
    this.document.head.appendChild(link);
  }
}
