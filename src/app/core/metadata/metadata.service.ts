import 'rxjs/add/operator/first'
import 'rxjs/add/operator/take'

import { Inject, Injectable } from '@angular/core';
import {
  ActivatedRoute,
  Event,
  NavigationEnd,
  Params,
  Router
} from '@angular/router';

import { Meta, MetaDefinition, Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { RemoteData } from '../data/remote-data';
import { Bitstream } from '../shared/bitstream.model';
import { CacheableObject } from '../cache/object-cache.reducer';
import { DSpaceObject } from '../shared/dspace-object.model';
import { Item } from '../shared/item.model';
import { Metadatum } from '../shared/metadatum.model';

import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { BitstreamFormat } from '../shared/bitstream-format.model';
import { hasValue, isNotEmpty } from '../../shared/empty.util';

@Injectable()
export class MetadataService {

  private initialized: boolean;

  private tagStore: Map<string, MetaDefinition[]>;

  private currentObject: BehaviorSubject<DSpaceObject>;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private meta: Meta,
    private title: Title,
    @Inject(GLOBAL_CONFIG) private envConfig: GlobalConfig
  ) {
    // TODO: determine what open graph meta tags are needed and whether
    // the differ per route. potentially add image based on DSpaceObject
    this.meta.addTags([
      { property: 'og:title', content: 'DSpace Angular Universal' },
      { property: 'og:description', content: 'The modern front-end for DSpace 7.' }
    ]);
    this.initialized = false;
    this.tagStore = new Map<string, MetaDefinition[]>();
  }

  public listenForRouteChange(): void {
    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .map(() => this.router.routerState.root)
      .map((route: ActivatedRoute) => {
        route = this.getCurrentRoute(route);
        return { params: route.params, data: route.data };
      }).subscribe((routeInfo: any) => {
        this.processRouteChange(routeInfo);
      });
  }

  public processRemoteData(remoteData: Observable<RemoteData<CacheableObject>>): void {
    remoteData.map((rd: RemoteData<CacheableObject>) => rd.payload)
      .filter((co: CacheableObject) => hasValue(co))
      .take(1)
      .subscribe((dspaceObject: DSpaceObject) => {
        if (!this.initialized) {
          this.initialize(dspaceObject);
        }
        this.currentObject.next(dspaceObject);
      });
  }

  private processRouteChange(routeInfo: any): void {
    if (routeInfo.params.value.id === undefined) {
      this.clearMetaTags();
    }
    if (routeInfo.data.value.title) {
      this.translate.get(routeInfo.data.value.title).take(1).subscribe((translatedTitle: string) => {
        this.addMetaTag('title', translatedTitle);
        this.title.setTitle(translatedTitle);
      });
    }
    if (routeInfo.data.value.description) {
      this.translate.get(routeInfo.data.value.description).take(1).subscribe((translatedDescription: string) => {
        this.addMetaTag('description', translatedDescription);
      });
    }
  }

  private initialize(dspaceObject: DSpaceObject): void {
    this.currentObject = new BehaviorSubject<DSpaceObject>(dspaceObject);
    this.currentObject.asObservable().distinctUntilKeyChanged('uuid').subscribe(() => {
      this.setMetaTags();
    });
    this.initialized = true;
  }

  private getCurrentRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  private setMetaTags(): void {

    this.clearMetaTags();

    this.setTitleTag();
    this.setDescriptionTag();

    this.setCitationTitleTag();
    this.setCitationAuthorTags();
    this.setCitationDateTag();
    this.setCitationISSNTag();
    this.setCitationISBNTag();

    this.setCitationLanguageTag();
    this.setCitationKeywordsTag();

    this.setCitationAbstractUrlTag();
    this.setCitationPdfUrlTag();

    if (this.isDissertation()) {
      this.setCitationDissertationNameTag();
      this.setCitationDissertationInstitutionTag();
    }

    if (this.isTechReport()) {
      this.setCitationTechReportInstitutionTag();
    }

    // this.setCitationJournalTitleTag();
    // this.setCitationVolumeTag();
    // this.setCitationIssueTag();
    // this.setCitationFirstPageTag();
    // this.setCitationLastPageTag();
    // this.setCitationDOITag();
    // this.setCitationPMIDTag();

    // this.setCitationFullTextTag();

    // this.setCitationConferenceTag();

    // this.setCitationPatentCountryTag();
    // this.setCitationPatentNumberTag();

  }

  /**
   * Add <meta name="title" ... >  to the <head>
   */
  private setTitleTag(): void {
    const value = this.getMetaTagValue('dc.title');
    this.addMetaTag('title', value);
    this.title.setTitle(value);
  }

  /**
   * Add <meta name="description" ... >  to the <head>
   */
  private setDescriptionTag(): void {
    // TODO: truncate abstract
    const value = this.getMetaTagValue('dc.description.abstract');
    this.addMetaTag('desciption', value);
  }

  /**
   * Add <meta name="citation_title" ... >  to the <head>
   */
  private setCitationTitleTag(): void {
    const value = this.getMetaTagValue('dc.title');
    this.addMetaTag('citation_title', value);
  }

  /**
   * Add <meta name="citation_author" ... >  to the <head>
   */
  private setCitationAuthorTags(): void {
    const values: string[] = this.getMetaTagValues(['dc.author', 'dc.contributor.author', 'dc.creator']);
    this.addMetaTags('citation_author', values);
  }

  /**
   * Add <meta name="citation_date" ... >  to the <head>
   */
  private setCitationDateTag(): void {
    const value = this.getFirstMetaTagValue(['dc.date.copyright', 'dc.date.issued', 'dc.date.available', 'dc.date.accessioned']);
    this.addMetaTag('citation_date', value);
  }

  /**
   * Add <meta name="citation_issn" ... >  to the <head>
   */
  private setCitationISSNTag(): void {
    const value = this.getMetaTagValue('dc.identifier.issn');
    this.addMetaTag('citation_issn', value);
  }

  /**
   * Add <meta name="citation_isbn" ... >  to the <head>
   */
  private setCitationISBNTag(): void {
    const value = this.getMetaTagValue('dc.identifier.isbn');
    this.addMetaTag('citation_isbn', value);
  }

  /**
   * Add <meta name="citation_language" ... >  to the <head>
   */
  private setCitationLanguageTag(): void {
    const value = this.getFirstMetaTagValue(['dc.language', 'dc.language.iso']);
    this.addMetaTag('citation_language', value);
  }

  /**
   * Add <meta name="citation_dissertation_name" ... >  to the <head>
   */
  private setCitationDissertationNameTag(): void {
    const value = this.getMetaTagValue('dc.title');
    this.addMetaTag('citation_dissertation_name', value);
  }

  /**
   * Add <meta name="citation_dissertation_institution" ... >  to the <head>
   */
  private setCitationDissertationInstitutionTag(): void {
    const value = this.getMetaTagValue('dc.publisher');
    this.addMetaTag('citation_dissertation_institution', value);
  }

  /**
   * Add <meta name="citation_technical_report_institution" ... >  to the <head>
   */
  private setCitationTechReportInstitutionTag(): void {
    const value = this.getMetaTagValue('dc.publisher');
    this.addMetaTag('citation_technical_report_institution', value);
  }

  /**
   * Add <meta name="citation_keywords" ... >  to the <head>
   */
  private setCitationKeywordsTag(): void {
    const value = this.getMetaTagValuesAndCombine('dc.subject');
    this.addMetaTag('citation_keywords', value);
  }

  /**
   * Add <meta name="citation_abstract_html_url" ... >  to the <head>
   */
  private setCitationAbstractUrlTag(): void {
    if (this.currentObject.value instanceof Item) {
      const value = [this.envConfig.ui.baseUrl, this.router.url].join('');
      this.addMetaTag('citation_abstract_html_url', value);
    }
  }

  /**
   * Add <meta name="citation_pdf_url" ... >  to the <head>
   */
  private setCitationPdfUrlTag(): void {
    if (this.currentObject.value instanceof Item) {
      const item = this.currentObject.value as Item;
      item.getFiles().filter((files) => isNotEmpty(files)).first().subscribe((bitstreams: Bitstream[]) => {
        for (const bitstream of bitstreams) {
          bitstream.format.first()
            .map((rd: RemoteData<BitstreamFormat>) => rd.payload)
            .filter((format: BitstreamFormat) => hasValue(format))
            .subscribe((format: BitstreamFormat) => {
              if (format.mimetype === 'application/pdf') {
                this.addMetaTag('citation_pdf_url', bitstream.content);
              }
            });
        }
      });
    }
  }

  /**
   * Returns true if this._item is a dissertation
   *
   * @returns {boolean}
   *      true if this._item has a dc.type equal to 'Thesis'
   */
  private isDissertation(): boolean {
    let isDissertation = false;
    for (const metadatum of this.currentObject.value.metadata) {
      if (metadatum.key === 'dc.type') {
        isDissertation = metadatum.value.toLowerCase() === 'thesis';
        break;
      }
    }
    return isDissertation;
  }

  /**
   * Returns true if this._item is a technical report
   *
   * @returns {boolean}
   *      true if this._item has a dc.type equal to 'Technical Report'
   */
  private isTechReport(): boolean {
    let isTechReport = false;
    for (const metadatum of this.currentObject.value.metadata) {
      if (metadatum.key === 'dc.type') {
        isTechReport = metadatum.value.toLowerCase() === 'technical report';
        break;
      }
    }
    return isTechReport;
  }

  private getMetaTagValue(key: string): string {
    let value: string;
    for (const metadatum of this.currentObject.value.metadata) {
      if (metadatum.key === key) {
        value = metadatum.value;
      }
    }
    return value;
  }

  private getFirstMetaTagValue(keys: string[]): string {
    let value: string;
    for (const metadatum of this.currentObject.value.metadata) {
      for (const key of keys) {
        if (key === metadatum.key) {
          value = metadatum.value;
          break;
        }
      }
      if (value !== undefined) {
        break;
      }
    }
    return value;
  }

  private getMetaTagValuesAndCombine(key: string): string {
    return this.getMetaTagValues([key]).join('; ');
  }

  private getMetaTagValues(keys: string[]): string[] {
    const values: string[] = [];
    for (const metadatum of this.currentObject.value.metadata) {
      for (const key of keys) {
        if (key === metadatum.key) {
          values.push(metadatum.value);
        }
      }
    }
    return values;
  }

  private addMetaTag(property: string, content: string): void {
    if (content) {
      const tag = { property, content } as MetaDefinition;
      this.meta.addTag(tag);
      this.storeTag(property, tag);
    }
  }

  private addMetaTags(property: string, content: string[]): void {
    for (const value of content) {
      this.addMetaTag(property, value);
    }
  }

  private storeTag(key: string, tag: MetaDefinition): void {
    const tags: MetaDefinition[] = this.getTags(key);
    tags.push(tag);
    this.setTags(key, tags);
  }

  private getTags(key: string): MetaDefinition[] {
    let tags: MetaDefinition[] = this.tagStore.get(key);
    if (tags === undefined) {
      tags = [];
    }
    return tags;
  }

  private setTags(key: string, tags: MetaDefinition[]): void {
    this.tagStore.set(key, tags);
  }

  public clearMetaTags() {
    this.tagStore.forEach((tags: MetaDefinition[], property: string) => {
      this.meta.removeTag("property='" + property + "'");
    });
    this.tagStore.clear();
  }

  public getTagStore(): Map<string, MetaDefinition[]> {
    return this.tagStore;
  }

}
