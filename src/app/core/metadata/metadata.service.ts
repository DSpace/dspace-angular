import { Injectable } from '@angular/core';

import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { BehaviorSubject, combineLatest, Observable, of as observableOf, EMPTY } from 'rxjs';
import { distinctUntilKeyChanged, filter, map, take, switchMap, expand } from 'rxjs/operators';

import { hasValue, hasNoValue } from '../../shared/empty.util';
import { DSONameService } from '../breadcrumbs/dso-name.service';
import { CacheableObject } from '../cache/object-cache.reducer';
import { BitstreamDataService } from '../data/bitstream-data.service';
import { BitstreamFormatDataService } from '../data/bitstream-format-data.service';

import { RemoteData } from '../data/remote-data';
import { BitstreamFormat } from '../shared/bitstream-format.model';
import { Bitstream } from '../shared/bitstream.model';
import { DSpaceObject } from '../shared/dspace-object.model';
import { Item } from '../shared/item.model';
import {
  getFirstSucceededRemoteDataPayload,
  getFirstCompletedRemoteData
} from '../shared/operators';
import { environment } from '../../../environments/environment';
import { RootDataService } from '../data/root-data.service';
import { getBitstreamDownloadRoute } from '../../app-routing-paths';
import { BundleDataService } from '../data/bundle-data.service';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { Bundle } from '../shared/bundle.model';
import { PaginatedList } from '../data/paginated-list.model';

@Injectable()
export class MetadataService {

  private initialized: boolean;

  private tagStore: Map<string, MetaDefinition[]>;

  private currentObject: BehaviorSubject<DSpaceObject>;

  private readonly ALLOWED_MIMETYPES = [
    'application/pdf',                                                          // .pdf
    'application/postscript',                                                   // .ps
    'application/msword',                                                       // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',  // .docx
    'application/rtf',                                                          // .rtf
    'application/epub+zip',                                                     // .epub
  ];

  constructor(
    private router: Router,
    private translate: TranslateService,
    private meta: Meta,
    private title: Title,
    private dsoNameService: DSONameService,
    private bundleDataService: BundleDataService,
    private bitstreamDataService: BitstreamDataService,
    private bitstreamFormatDataService: BitstreamFormatDataService,
    private rootService: RootDataService
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
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.routerState.root),
      map((route: ActivatedRoute) => {
        route = this.getCurrentRoute(route);
        return { params: route.params, data: route.data };
      })).subscribe((routeInfo: any) => {
      this.processRouteChange(routeInfo);
    });
  }

  public processRemoteData(remoteData: Observable<RemoteData<CacheableObject>>): void {
    remoteData.pipe(map((rd: RemoteData<CacheableObject>) => rd.payload),
      filter((co: CacheableObject) => hasValue(co)),
      take(1))
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
      const titlePrefix = this.translate.get('repository.title.prefix');
      const title = this.translate.get(routeInfo.data.value.title, routeInfo.data.value);
      combineLatest([titlePrefix, title]).pipe(take(1)).subscribe(([translatedTitlePrefix, translatedTitle]: [string, string]) => {
        this.addMetaTag('title', translatedTitlePrefix + translatedTitle);
        this.title.setTitle(translatedTitlePrefix + translatedTitle);
      });
    }
    if (routeInfo.data.value.description) {
      this.translate.get(routeInfo.data.value.description).pipe(take(1)).subscribe((translatedDescription: string) => {
        this.addMetaTag('description', translatedDescription);
      });
    }

    this.setGenerator();
  }

  private initialize(dspaceObject: DSpaceObject): void {
    this.currentObject = new BehaviorSubject<DSpaceObject>(dspaceObject);
    this.currentObject.asObservable().pipe(distinctUntilKeyChanged('uuid')).subscribe(() => {
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
    const value = this.dsoNameService.getName(this.currentObject.getValue());
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
      const value = [environment.ui.baseUrl, this.router.url].join('');
      this.addMetaTag('citation_abstract_html_url', value);
    }
  }

  /**
   * Add <meta name="citation_pdf_url" ... >  to the <head>
   */
  private setCitationPdfUrlTag(): void {
    if (this.currentObject.value instanceof Item) {
      const item = this.currentObject.value as Item;

      // Retrieve the ORIGINAL bundle for the item
      this.bundleDataService.findByItemAndName(
        item,
        'ORIGINAL',
        true,
        true,
        followLink('primaryBitstream'),
        followLink('bitstreams',
          undefined,
          true,
          true,
          true,
          followLink('format')
        )
      ).pipe(
        getFirstSucceededRemoteDataPayload(),
        switchMap((bundle: Bundle) =>

          // First try the primary bitstream
          bundle.primaryBitstream.pipe(
            getFirstCompletedRemoteData(),
            map((rd: RemoteData<Bitstream>) => {
              if (hasValue(rd.payload)) {
                return rd.payload;
              } else {
                return null;
              }
            }),
            // return the bundle as well so we can use it again if there's no primary bitstream
            map((bitstream: Bitstream) => [bundle, bitstream])
          )
        ),
        switchMap(([bundle, primaryBitstream]: [Bundle, Bitstream]) => {
          if (hasValue(primaryBitstream)) {
            // If there was a primary bitstream, emit its link
            return [getBitstreamDownloadRoute(primaryBitstream)];
          } else {
            // Otherwise consider the regular bitstreams in the bundle
            return bundle.bitstreams.pipe(
              getFirstCompletedRemoteData(),
              switchMap((bitstreamRd: RemoteData<PaginatedList<Bitstream>>) => {
                if (hasValue(bitstreamRd.payload) && bitstreamRd.payload.totalElements === 1) {
                  // If there's only one bitstream in the bundle, emit its link
                  return [getBitstreamDownloadRoute(bitstreamRd.payload.page[0])];
                } else {
                  // Otherwise check all bitstreams to see if one matches the format whitelist
                  return this.getBitstreamDownloadRoute(bitstreamRd);
                }
              })
            );
          }
        }),
        take(1)
      ).subscribe((link: string) => {
        // Use the found link to set the <meta> tag
        this.addMetaTag('citation_pdf_url', link);
      });
    }
  }

  private getBitstreamDownloadRoute(bitstreamRd: RemoteData<PaginatedList<Bitstream>>): Observable<string> {
    return observableOf(bitstreamRd.payload).pipe(
      // Because there can be more than one page of bitstreams, this expand operator
      // will retrieve them in turn due to the take(1) at the bottom, it will only
      // retrieve pages until a match is found
      expand((paginatedList: PaginatedList<Bitstream>) => {
        if (hasNoValue(paginatedList.next)) {
          // If there's no next page, stop.
          return EMPTY;
        } else {
          // Otherwise retrieve the next page
          return this.bitstreamDataService.findAllByHref(
            paginatedList.next,
            undefined,
            true,
            true,
            followLink('format')
          ).pipe(
            getFirstCompletedRemoteData(),
            map((next: RemoteData<PaginatedList<Bitstream>>) => {
              if (hasValue(next.payload)) {
                return next.payload;
              } else {
                return EMPTY;
              }
            })
          );
        }
      }),
      // Return the array of bitstreams inside each paginated list
      map((paginatedList: PaginatedList<Bitstream>) => paginatedList.page),
      // Emit the bitstreams in the list one at a time
      switchMap((bitstreams: Bitstream[]) => bitstreams),
      // Retrieve the format for each bitstream
      switchMap((bitstream: Bitstream) => bitstream.format.pipe(
        getFirstSucceededRemoteDataPayload(),
        // Keep the original bitstream, because it, not the format, is what we'll need
        // for the link at the end
        map((format: BitstreamFormat) => [bitstream, format])
      )),
      // Filter out only pairs with whitelisted formats
      filter(([, format]: [Bitstream, BitstreamFormat]) =>
        hasValue(format) && this.ALLOWED_MIMETYPES.includes(format.mimetype)),
      // We only need 1
      take(1),
      // Emit the link of the match
      map(([bitstream, ]: [Bitstream, BitstreamFormat]) => getBitstreamDownloadRoute(bitstream))
    );
  }

  /**
   * Add <meta name="Generator" ... >  to the <head> containing the current DSpace version
   */
  private setGenerator(): void {
    this.rootService.findRoot().pipe(getFirstSucceededRemoteDataPayload()).subscribe((root) => {
      this.addMetaTag('Generator', root.dspaceVersion);
    });
  }

  private hasType(value: string): boolean {
    return this.currentObject.value.hasMetadata('dc.type', { value: value, ignoreCase: true });
  }

  /**
   * Returns true if this._item is a dissertation
   *
   * @returns {boolean}
   *      true if this._item has a dc.type equal to 'Thesis'
   */
  private isDissertation(): boolean {
    return this.hasType('thesis');
  }

  /**
   * Returns true if this._item is a technical report
   *
   * @returns {boolean}
   *      true if this._item has a dc.type equal to 'Technical Report'
   */
  private isTechReport(): boolean {
    return this.hasType('technical report');
  }

  private getMetaTagValue(key: string): string {
    return this.currentObject.value.firstMetadataValue(key);
  }

  private getFirstMetaTagValue(keys: string[]): string {
    return this.currentObject.value.firstMetadataValue(keys);
  }

  private getMetaTagValuesAndCombine(key: string): string {
    return this.getMetaTagValues([key]).join('; ');
  }

  private getMetaTagValues(keys: string[]): string[] {
    return this.currentObject.value.allMetadataValues(keys);
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
      this.meta.removeTag('property=\'' + property + '\'');
    });
    this.tagStore.clear();
  }

  public getTagStore(): Map<string, MetaDefinition[]> {
    return this.tagStore;
  }

}
