import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import {
  BehaviorSubject,
  combineLatest,
  concat as observableConcat,
  EMPTY,
  Observable,
  of as observableOf,
  of
} from 'rxjs';
import { filter, map, mergeMap, switchMap, take } from 'rxjs/operators';

import { hasNoValue, hasValue, isNotEmpty } from '../../shared/empty.util';
import { DSONameService } from '../breadcrumbs/dso-name.service';

import { RemoteData } from '../data/remote-data';
import { BitstreamFormat } from '../shared/bitstream-format.model';
import { Bitstream } from '../shared/bitstream.model';
import { DSpaceObject } from '../shared/dspace-object.model';
import { Item } from '../shared/item.model';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteDataPayload } from '../shared/operators';
import { RootDataService } from '../data/root-data.service';
import { getBitstreamDownloadRoute } from '../../app-routing-paths';
import { BundleDataService } from '../data/bundle-data.service';
import { PaginatedList } from '../data/paginated-list.model';
import { URLCombiner } from '../url-combiner/url-combiner';
import { HardRedirectService } from '../services/hard-redirect.service';
import { MetaTagState } from './meta-tag.reducer';
import { createSelector, select, Store } from '@ngrx/store';
import { AddMetaTagAction, ClearMetaTagAction } from './meta-tag.actions';
import { coreSelector } from '../core.selectors';
import { CoreState } from '../core-state.model';
import { AuthorizationDataService } from '../data/feature-authorization/authorization-data.service';
import { getDownloadableBitstream } from '../shared/bitstream.operators';
import { APP_CONFIG, AppConfig } from '../../../config/app-config.interface';
import { FindListOptions } from '../data/find-list-options.model';
import { SchemaJsonLDService } from './schema-json-ld/schema-json-ld.service';
import { ITEM } from '../shared/item.resource-type';
import { DOCUMENT, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Root } from '../data/root.model';
import { environment } from '../../../environments/environment';
import { Bundle } from '../shared/bundle.model';
import { followLink } from '../../shared/utils/follow-link-config.model';

/**
 * The base selector function to select the metaTag section in the store
 */
const metaTagSelector = createSelector(
  coreSelector,
  (state: CoreState) => state.metaTag
);

/**
 * Selector function to select the tags in use from the MetaTagState
 */
const tagsInUseSelector =
  createSelector(
    metaTagSelector,
    (state: MetaTagState) => state.tagsInUse,
  );

@Injectable()
export class MetadataService {

  private currentObject: BehaviorSubject<DSpaceObject> = new BehaviorSubject<DSpaceObject>(undefined);

  /**
   * When generating the citation_pdf_url meta tag for Items with more than one Bitstream (and no primary Bitstream),
   * the first Bitstream to match one of the following MIME types is selected.
   * See {@linkcode getFirstAllowedFormatBitstreamLink}
   * @private
   */
  private readonly CITATION_PDF_URL_MIMETYPES = [
    'application/pdf',                                                          // .pdf
    'application/postscript',                                                   // .ps
    'application/msword',                                                       // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',  // .docx
    'application/rtf',                                                          // .rtf
    'application/epub+zip',                                                     // .epub
  ];

  private fallbackImagePath = environment.metaTags.defaultLogo;
  private defaultPageDescription = environment.metaTags.defaultDescription;
  private origin: string;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private meta: Meta,
    private title: Title,
    private dsoNameService: DSONameService,
    private bundleDataService: BundleDataService,
    private rootService: RootDataService,
    private store: Store<CoreState>,
    private hardRedirectService: HardRedirectService,
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    private authorizationService: AuthorizationDataService,
    private schemaJsonLDService: SchemaJsonLDService,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private _document: Document,
  ) {
  }

  public listenForRouteChange(): void {
    // This never changes, set it only once
    this.setGenerator();

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

  private processRouteChange(routeInfo: any): void {
    this.rootService.findRoot().pipe(
      getFirstCompletedRemoteData(),
      filter(data => !!data),
    map((rootRD: RemoteData<Root>) => rootRD?.payload?.dspaceUI)
    ).subscribe(uiOrigin => this.origin = uiOrigin);

    this.clearMetaTags();

    if (hasValue(routeInfo.data.value.dso) && hasValue(routeInfo.data.value.dso.payload)) {
      this.currentObject.next(routeInfo.data.value.dso.payload);
      this.setDSOMetaTags();
    }

    if (routeInfo.data.value.title) {
      const repositoryName$ = this.rootService.findRoot(true).pipe(
        getFirstSucceededRemoteDataPayload(),
        map((payload: Root) => payload.dspaceName),
      );
      const titlePrefix = repositoryName$.pipe(
        switchMap((repositoryName) => this.translate.get('repository.title.prefix', { repositoryName })),
      );
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

    if (hasValue(routeInfo.data.value.dso) && hasValue(routeInfo.data.value.dso.payload)) {
      this.currentObject.next(routeInfo.data.value.dso.payload);
      this.setDSOMetaTags();
      if (routeInfo.data.value.dso.payload.type === ITEM.value && isPlatformServer(this.platformId)) {
        this.schemaJsonLDService.insertSchema(routeInfo.data.value.dso.payload);
      }
    }

    if (!hasValue(routeInfo.data.value.dso)) {
      this.setGenericPageMetaTags();
    }


  }

  private getCurrentRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }

  private setDSOMetaTags(): void {
    const openGraphType = this.getOpenGraphType();

    this.setTitleTags();
    this.setDescriptionTags();

    this.setOpenGraphImageTag();
    this.setOpenGraphUrlTag();

    if (openGraphType) {
      this.setOpenGraphTypeTag(openGraphType);
    }

    this.setTwitterImageTag();
    this.setTwitterSummaryCardTag();

    if (!this.isResearchOutput()) {
      return;
    }
    this.setCitationTitleTag();
    this.setCitationAuthorTags();
    this.setCitationPublicationDateTag();
    this.setCitationISSNTag();
    this.setCitationISBNTag();

    this.setCitationLanguageTag();
    this.setCitationKeywordsTag();

    this.setCitationAbstractUrlTag();
    this.setCitationPdfUrlTag();
    this.setCitationPublisherTag();

    if (this.isDissertation()) {
      this.setCitationDissertationNameTag();
    }

    this.setCitationJournalTitleTag();
    this.setCitationVolumeTag();
    this.setCitationIssueTag();
    this.setCitationFirstPageTag();
    this.setCitationLastPageTag();
    this.setCitationDOITag();
    this.setCitationPMIDTag();
    this.setCitationArxivIdTag();
    this.setCitationConferenceTag();

    if (this.isTechReport()) {
      this.setCitationTechnicalReportNumberTag();
    }
  }

  /**
   * Add <meta name="title" ... >  and
   * <meta name="og:title" ... > and
   * <meta name="twitter:title" ... >  to the <head>
   */
  private setTitleTags(title?: string): void {
    const value = title ?? this.dsoNameService.getName(this.currentObject.getValue());

    this.addMetaTag('title', value);
    this.addMetaTag('og:title', value, true);
    this.addMetaTag('twitter:title', value, true);

    this.title.setTitle(value);
  }

  /**
   * Add <meta name="description" ... > and
   * <meta name="og:description" ... >  and
   * <meta name="twitter:description" ... >  to the <head>
   */
  private setDescriptionTags(description?: string): void {
    // TODO: truncate abstract
    const value = description ?? this.getMetaTagValue('dc.description.abstract');
    this.addMetaTag('description', value);
    this.addMetaTag('og:description', value, true);
    this.addMetaTag('twitter:description', value, true);
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
   * Add <meta name="citation_publication_date" ... >  to the <head>
   */
  private setCitationPublicationDateTag(): void {
    const value = this.getFirstMetaTagValue(['dc.date.copyright', 'dc.date.issued', 'dc.date.available', 'dc.date.accessioned']);
    this.addMetaTag('citation_publication_date', value);
  }

  /**
   * Add <meta name="citation_issn" ... >  to the <head>
   */
  private setCitationISSNTag(): void {
    const value = this.getMetaTagValue('dc.relation.issn');
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
   * Add dc.publisher to the <head>. The tag name depends on the item type.
   */
  private setCitationPublisherTag(): void {
    const value = this.getMetaTagValue('dc.publisher');
    if (this.isDissertation()) {
      this.addMetaTag('citation_dissertation_institution', value);
    } else if (this.isTechReport()) {
      this.addMetaTag('citation_technical_report_institution', value);
    } else {
      this.addMetaTag('citation_publisher', value);
    }
  }

  /**
   * Add <meta name="citation_keywords" ... >  to the <head>
   */
  private setCitationKeywordsTag(): void {
    const value = this.getMetaTagValuesAndCombine('dc.subject');
    this.addMetaTag('citation_keywords', value);
  }

  /**
   * Add <meta name="citation_journal_title" ... >  to the <head>
   */
  private setCitationJournalTitleTag(): void {
    const value = this.getMetaTagValue('dc.relation.ispartof');
    this.addMetaTag('citation_journal_title', value);
  }

  /**
   * Add <meta name="citation_volume" ... >  to the <head>
   */
  private setCitationVolumeTag(): void {
    const value = this.getMetaTagValue('oaire.citation.volume');
    this.addMetaTag('citation_volume', value);
  }

  /**
   * Add <meta name="citation_issue" ... >  to the <head>
   */
  private setCitationIssueTag(): void {
    const value = this.getMetaTagValue('oaire.citation.issue');
    this.addMetaTag('citation_issue', value);
  }

  /**
   * Add <meta name="citation_firstpage" ... >  to the <head>
   */
  private setCitationFirstPageTag(): void {
    const value = this.getMetaTagValue('oaire.citation.startPage');
    this.addMetaTag('citation_firstpage', value);
  }

  /**
   * Add <meta name="citation_firstpage" ... >  to the <head>
   */
  private setCitationLastPageTag(): void {
    const value = this.getMetaTagValue('oaire.citation.endPage');
    this.addMetaTag('citation_lastpage', value);
  }

  /**
   * Add <meta name="citation_doi" ... >  to the <head>
   */
  private setCitationDOITag(): void {
    const value = this.getMetaTagValue('dc.identifier.doi');
    this.addMetaTag('citation_doi', value);
  }

  /**
   * Add <meta name="citation_pmid" ... >  to the <head>
   */
  private setCitationPMIDTag(): void {
    const value = this.getMetaTagValue('dc.identifier.pmid');
    this.addMetaTag('citation_pmid', value);
  }

  /**
   * Add <meta name="citation_arxiv_id" ... >  to the <head>
   */
  private setCitationArxivIdTag(): void {
    const value = this.getMetaTagValue('dc.identifier.arxiv');
    this.addMetaTag('citation_arxiv_id', value);
  }

  /**
   * Add <meta name="citation_conference_title" ... >  to the <head>
   */
   private setCitationConferenceTag(): void {
    const value = this.getMetaTagValue('dc.relation.conference');
    this.addMetaTag('citation_conference_title', value);
  }

  /**
   * Add <meta name="citation_technical_report_number" ... >  to the <head>
   */
   private setCitationTechnicalReportNumberTag(): void {
    const value = this.getMetaTagValue('dc.relation.ispartofseries');
    this.addMetaTag('citation_technical_report_number', value);
  }

  /**
   * Add <meta name="citation_abstract_html_url" ... >  to the <head>
   */
  private setCitationAbstractUrlTag(): void {
    if (this.currentObject.value instanceof Item) {
      let url = this.getMetaTagValue('dc.identifier.uri');
      if (hasNoValue(url)) {
        url = new URLCombiner(this.hardRedirectService.getCurrentOrigin(), this.router.url).toString();
      }
      this.addMetaTag('citation_abstract_html_url', url);
    }
  }

  /**
   * Add <meta name="citation_pdf_url" ... >  to the <head>
   */
  private setCitationPdfUrlTag(): void {
    this.setPrimaryBitstreamInBundleTag('citation_pdf_url');
  }

  /**
   * Add <meta name="og:type" ... >  to the <head>
   */
  private setOpenGraphTypeTag(type: string): void {
    this.addMetaTag('og:type', type ?? 'website', true);
  }

  /**
   * Add <meta name="og:image" ... >  to the <head>
   */
  private setOpenGraphImageTag(): void {
    this.setPrimaryImageInBundleTag('og:image');
  }

  /**
   * Add <meta name="og:url" ... >  to the <head>
   */
  private setOpenGraphUrlTag(url?: string): void {
    const value = url ?? this.getMetaTagValue('dc.identifier.uri');
    this.addMetaTag('og:url', value);
}


  /**
   * Add <meta name="twitter:image" ... >  to the <head>
   */
  private setTwitterImageTag(): void {
    this.setPrimaryImageInBundleTag('twitter:image');
  }

  /**
   * Add <meta name="twitter:card" ... >  to the <head>
   */
  private setTwitterSummaryCardTag(): void {
    this.addMetaTag('twitter:card', 'summary');
  }

  /**
   * Get bitstream from item thumbnail link
   *
   * @param item
   * @private
   */
  private getBitstreamFromThumbnail(item: Item): Observable<Bitstream> {
    return hasValue(item.thumbnail) ? item.thumbnail.pipe(
      getFirstCompletedRemoteData(),
      map((thumbnailRD) => {
        if (thumbnailRD.hasSucceeded && isNotEmpty(thumbnailRD.payload)) {
          return thumbnailRD.payload;
        } else {
          return null;
        }
      }),
      getDownloadableBitstream(this.authorizationService)
    ) : of(null);
  }

  private setPrimaryBitstreamInBundleTag(tag: string): void {
    if (this.currentObject.value instanceof Item) {
      const item = this.currentObject.value as Item;

      // Retrieve the ORIGINAL bundle for the item
      this.bundleDataService.findByItemAndName(
        item,
        'ORIGINAL',
        true,
        true,
        new FindListOptions(),
        followLink('primaryBitstream'),
        followLink('bitstreams', {
          findListOptions: {
            // limit the number of bitstreams used to find the citation pdf url to the number
            // shown by default on an item page
            elementsPerPage: this.appConfig.item.bitstream.pageSize,
          },
        }, followLink('format')),
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
            getDownloadableBitstream(this.authorizationService),
            // return the bundle as well so we can use it again if there's no primary bitstream
            map((bitstream: Bitstream) => [bundle, bitstream]),
          ),
        ),
        switchMap(([bundle, primaryBitstream]: [Bundle, Bitstream]) => {
          if (hasValue(primaryBitstream)) {
            // If there was a downloadable primary bitstream, emit its link
            return [getBitstreamDownloadRoute(primaryBitstream)];
          } else {
            // Otherwise consider the regular bitstreams in the bundle
            return bundle.bitstreams.pipe(
              getFirstCompletedRemoteData(),
              switchMap((bitstreamRd: RemoteData<PaginatedList<Bitstream>>) => {
                if (hasValue(bitstreamRd.payload) && bitstreamRd.payload.totalElements === 1) {
                  // If there's only one bitstream in the bundle, emit its link if its downloadable
                  return this.getBitLinkIfDownloadable(bitstreamRd.payload.page[0], bitstreamRd);
                } else {
                  // Otherwise check all bitstreams to see if one matches the format whitelist
                  return this.getFirstAllowedFormatBitstreamLink(bitstreamRd);
                }
              }),
            );
          }
        }),
        take(1),
      ).subscribe((link: string) => {
        // Use the found link to set the <meta> tag
        this.addMetaTag(
          tag,
          new URLCombiner(this.hardRedirectService.getCurrentOrigin(), link).toString(),
          true,
        );
      });
    }
  }

  private setPrimaryImageInBundleTag(tag: string): void {
    if (this.currentObject.value instanceof Item) {
      const item = this.currentObject.value as Item;
      this.getBitstreamFromThumbnail(item).pipe(
        map((bitstream) => {
          if (hasValue(bitstream)) {
            return getBitstreamDownloadRoute(bitstream);
          } else {
            return null;
          }
        }),
        take(1),
      ).subscribe((link) => {
        if (hasValue(link)) {
          // Use the found link to set the <meta> tag
          this.addMetaTag(
            tag,
            new URLCombiner(this.getUrlOrigin(), link).toString(),
            true,
          );
        } else {
          this.addFallbackImageToTag(tag);
        }
      });
    } else {
      this.addFallbackImageToTag(tag);
    }
  }

  getBitLinkIfDownloadable(bitstream: Bitstream, bitstreamRd: RemoteData<PaginatedList<Bitstream>>): Observable<string> {
    return observableOf(bitstream).pipe(
      getDownloadableBitstream(this.authorizationService),
      switchMap((bit: Bitstream) => {
        if (hasValue(bit)) {
          return [getBitstreamDownloadRoute(bit)];
        } else {
          // Otherwise check all bitstreams to see if one matches the format whitelist
          return this.getFirstAllowedFormatBitstreamLink(bitstreamRd);
        }
      })
    );
  }

  /**
   * For Items with more than one Bitstream (and no primary Bitstream), link to the first Bitstream
   * with a MIME type.
   *
   * Note this will only check the current page (page size determined item.bitstream.pageSize in the
   * config) of bitstreams for performance reasons.
   * See https://github.com/DSpace/DSpace/issues/8648 for more info
   *
   * included in {@linkcode CITATION_PDF_URL_MIMETYPES}
   * @param bitstreamRd
   * @private
   */
  private getFirstAllowedFormatBitstreamLink(bitstreamRd: RemoteData<PaginatedList<Bitstream>>): Observable<string> {
    if (hasValue(bitstreamRd.payload) && isNotEmpty(bitstreamRd.payload.page)) {
      // Retrieve the formats of all bitstreams in the page sequentially
      return observableConcat(
        ...bitstreamRd.payload.page.map((bitstream: Bitstream) => bitstream.format.pipe(
          getFirstSucceededRemoteDataPayload(),
          // Keep the original bitstream, because it, not the format, is what we'll need
          // for the link at the end
          map((format: BitstreamFormat) => [bitstream, format])
        ))
      ).pipe(
        // Verify that the bitstream is downloadable
        mergeMap(([bitstream, format]: [Bitstream, BitstreamFormat]) => observableOf(bitstream).pipe(
          getDownloadableBitstream(this.authorizationService),
          map((bit: Bitstream) => [bit, format])
        )),
        // Filter out only pairs with whitelisted formats and non-null bitstreams, null from download check
        filter(([bitstream, format]: [Bitstream, BitstreamFormat]) =>
          hasValue(format) && hasValue(bitstream) && this.CITATION_PDF_URL_MIMETYPES.includes(format.mimetype)),
        // We only need 1
        take(1),
        // Emit the link of the match
        // tap((v) => console.log('result', v)),
        map(([bitstream, ]: [Bitstream, BitstreamFormat]) => getBitstreamDownloadRoute(bitstream))
      );
    } else {
      return EMPTY;
    }
  }

  /**
   * Add <meta name="Generator" ... >  to the <head> containing the current DSpace version
   */
  private setGenerator(): void {
    this.rootService.findRoot().pipe(getFirstSucceededRemoteDataPayload()).subscribe((root) => {
      this.meta.addTag({ name: 'Generator', content: root.dspaceVersion });
      this.meta.addTag({ name: 'Generator', content: root.crisVersion });
    });
  }

  private hasType(value: string): boolean {
    return this.currentObject.value.hasMetadata('dc.type', { value: value, ignoreCase: true, substring: true });
  }

  private hasEntityType(value: string): boolean {
    return this.currentObject.value.hasMetadata('dspace.entity.type', { value: value, ignoreCase: true });
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
   * Returns true if this._item is a research output (publication, patent or product)
   *
   * @returns {boolean}
   *      true if this._item has a dc.type equal to 'Thesis'
   */
   private isResearchOutput(): boolean {
    return this.hasEntityType('publication') || this.hasEntityType('product') || this.hasEntityType('patent');
  }

    /**
   * Returns true if this._item is a research output (publication, patent or product)
   *
   * @returns {boolean}
   *      true if this._item has a dc.type equal to 'Thesis'
   */
     private isPatent(): boolean {
      return this.hasEntityType('patent');
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
    return this.currentObject?.value?.firstMetadataValue(key);
  }

  private getFirstMetaTagValue(keys: string[]): string {
    return this.currentObject?.value?.firstMetadataValue(keys);
  }

  private getMetaTagValuesAndCombine(key: string): string {
    return this.getMetaTagValues([key]).join('; ');
  }

  private getMetaTagValues(keys: string[]): string[] {
    return this.currentObject.value.allMetadataValues(keys);
  }

  protected addMetaTag(name: string, content: string, isProperty = false, isMultiple = false): void {
    if (content) {
      const tag = isProperty ? { name, property: name, content } as MetaDefinition
        : { name, content } as MetaDefinition;
      isMultiple ? this.meta.addTag(tag) : this.meta.updateTag(tag);
      this.storeTag(name);
    }
  }

  private addMetaTags(name: string, content: string[]): void {
    // limit meta tags with the same name to avoid issues with page rendering
    for (const value of content.slice(0, this.appConfig.item.metatagLimit)) {
      this.addMetaTag(name, value, false, true);
    }
  }

  private storeTag(key: string): void {
    this.store.dispatch(new AddMetaTagAction(key));
  }

  public clearMetaTags() {
    this.schemaJsonLDService.removeStructuredData();
    this.store.pipe(
      select(tagsInUseSelector),
      take(1)
    ).subscribe((tagsInUse: string[]) => {
      for (const name of tagsInUse) {
        this.meta.getTags(`name="${name}"`).forEach((tag) => {
          this.meta.removeTagElement(tag);
        });
      }
      this.store.dispatch(new ClearMetaTagAction());
    });
  }

  private addFallbackImageToTag(tag: string) {
    this.addMetaTag(
      tag,
      new URLCombiner(this.getUrlOrigin(), this.fallbackImagePath).toString(),
      true
    );
  }

  private getOpenGraphType(): string {
    let type = '';
    if (this.currentObject.value instanceof Item) {
      const item = this.currentObject.value as Item;
      switch (item.entityType) {
        case 'News':
          type = 'article';
          break;
        case 'Publication':
          type =  'article';
          break;
        case 'Book':
          type =  'book';
          break;
        case 'Person':
          type =  'profile';
          break;
        case 'Audio':
          type =  'music';
          break;
        case 'Video':
          type =  'video';
          break;
        default:
          break;
      }
    }
    return type;
  }


  private setGenericPageMetaTags() {
    const pageDocumentTitle = this._document.getElementsByTagName('title')[0].innerText;
    const pageUrl = new URLCombiner(this.hardRedirectService.getCurrentOrigin(), this.router.url).toString();
    const genericPageOpenGraphType = 'website';

    this.setTitleTags(pageDocumentTitle);
    this.setDescriptionTags(this.defaultPageDescription);

    this.setOpenGraphUrlTag(pageUrl);
    this.setOpenGraphImageTag();
    this.setOpenGraphTypeTag(genericPageOpenGraphType);


    this.setTwitterImageTag();
    this.setTwitterSummaryCardTag();
  }

  private getUrlOrigin(): string {
    return isPlatformBrowser(this.platformId) ? this.hardRedirectService.getCurrentOrigin() : this.origin;
  }
}
