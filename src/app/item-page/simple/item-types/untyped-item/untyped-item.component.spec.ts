import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';

import { APP_CONFIG } from '../../../../../config/app-config.interface';
import { environment } from '../../../../../environments/environment.test';
import { BrowseDefinitionDataService } from '../../../../core/browse/browse-definition-data.service';
import { RemoteDataBuildService } from '../../../../core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../../core/cache/object-cache.service';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { CommunityDataService } from '../../../../core/data/community-data.service';
import { DefaultChangeAnalyzer } from '../../../../core/data/default-change-analyzer.service';
import { DSOChangeAnalyzer } from '../../../../core/data/dso-change-analyzer.service';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { RelationshipDataService } from '../../../../core/data/relationship-data.service';
import { RemoteData } from '../../../../core/data/remote-data';
import { VersionDataService } from '../../../../core/data/version-data.service';
import { VersionHistoryDataService } from '../../../../core/data/version-history-data.service';
import { RouteService } from '../../../../core/services/route.service';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { HALEndpointService } from '../../../../core/shared/hal-endpoint.service';
import { Item } from '../../../../core/shared/item.model';
import { MetadataMap } from '../../../../core/shared/metadata.models';
import { SearchService } from '../../../../core/shared/search/search.service';
import { UUIDService } from '../../../../core/shared/uuid.service';
import { WorkspaceitemDataService } from '../../../../core/submission/workspaceitem-data.service';
import { DsoEditMenuComponent } from '../../../../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { MetadataFieldWrapperComponent } from '../../../../shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { mockTruncatableService } from '../../../../shared/mocks/mock-trucatable.service';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { ThemedResultsBackButtonComponent } from '../../../../shared/results-back-button/themed-results-back-button.component';
import { BrowseDefinitionDataServiceStub } from '../../../../shared/testing/browse-definition-data-service.stub';
import { createPaginatedList } from '../../../../shared/testing/utils.test';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { ThemedThumbnailComponent } from '../../../../thumbnail/themed-thumbnail.component';
import { CollectionsComponent } from '../../../field-components/collections/collections.component';
import { ThemedMediaViewerComponent } from '../../../media-viewer/themed-media-viewer.component';
import { MiradorViewerComponent } from '../../../mirador-viewer/mirador-viewer.component';
import { ItemVersionsSharedService } from '../../../versions/item-versions-shared.service';
import { ThemedFileSectionComponent } from '../../field-components/file-section/themed-file-section.component';
import { ItemPageAbstractFieldComponent } from '../../field-components/specific-field/abstract/item-page-abstract-field.component';
import { ItemPageDateFieldComponent } from '../../field-components/specific-field/date/item-page-date-field.component';
import { GenericItemPageFieldComponent } from '../../field-components/specific-field/generic/generic-item-page-field.component';
import { ThemedItemPageTitleFieldComponent } from '../../field-components/specific-field/title/themed-item-page-field.component';
import { ItemPageUriFieldComponent } from '../../field-components/specific-field/uri/item-page-uri-field.component';
import { ThemedMetadataRepresentationListComponent } from '../../metadata-representation-list/themed-metadata-representation-list.component';
import {
  createRelationshipsObservable,
  getIIIFEnabled,
  getIIIFSearchEnabled,
  mockRouteService,
} from '../shared/item.component.spec';
import { UntypedItemComponent } from './untyped-item.component';

const noMetadata = new MetadataMap();

function getItem(metadata: MetadataMap) {
  return Object.assign(new Item(), {
    bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    metadata: metadata,
    relationships: createRelationshipsObservable(),
  });
}

describe('UntypedItemComponent', () => {
  let comp: UntypedItemComponent;
  let fixture: ComponentFixture<UntypedItemComponent>;

  beforeEach(waitForAsync(() => {
    const mockBitstreamDataService = {
      getThumbnailFor(item: Item): Observable<RemoteData<Bitstream>> {
        return createSuccessfulRemoteDataObject$(new Bitstream());
      },
    };
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        RouterTestingModule,
        GenericItemPageFieldComponent, TruncatePipe,
        UntypedItemComponent,
      ],
      providers: [
        { provide: ItemDataService, useValue: {} },
        { provide: TruncatableService, useValue: mockTruncatableService },
        { provide: RelationshipDataService, useValue: {} },
        { provide: ObjectCacheService, useValue: {} },
        { provide: UUIDService, useValue: {} },
        { provide: Store, useValue: {} },
        { provide: RemoteDataBuildService, useValue: {} },
        { provide: CommunityDataService, useValue: {} },
        { provide: HALEndpointService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: DSOChangeAnalyzer, useValue: {} },
        { provide: DefaultChangeAnalyzer, useValue: {} },
        { provide: VersionHistoryDataService, useValue: {} },
        { provide: VersionDataService, useValue: {} },
        { provide: BitstreamDataService, useValue: mockBitstreamDataService },
        { provide: WorkspaceitemDataService, useValue: {} },
        { provide: SearchService, useValue: {} },
        { provide: ItemDataService, useValue: {} },
        { provide: ItemVersionsSharedService, useValue: {} },
        { provide: RouteService, useValue: mockRouteService },
        { provide: BrowseDefinitionDataService, useValue: BrowseDefinitionDataServiceStub },
        { provide: APP_CONFIG, useValue: environment },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(UntypedItemComponent, {
      add: { changeDetection: ChangeDetectionStrategy.Default },
      remove: {
        imports: [
          ThemedResultsBackButtonComponent,
          MiradorViewerComponent,
          ThemedItemPageTitleFieldComponent,
          DsoEditMenuComponent,
          MetadataFieldWrapperComponent,
          ThemedThumbnailComponent,
          ThemedMediaViewerComponent,
          ThemedFileSectionComponent,
          ItemPageDateFieldComponent,
          ThemedMetadataRepresentationListComponent,
          GenericItemPageFieldComponent,
          ItemPageAbstractFieldComponent,
          ItemPageUriFieldComponent,
          CollectionsComponent,
        ],
      },
    });
  }));

  describe('default view', () => {
    beforeEach(waitForAsync(() => {
      TestBed.compileComponents();
      fixture = TestBed.createComponent(UntypedItemComponent);
      comp = fixture.componentInstance;
      comp.object = getItem(noMetadata);
      fixture.detectChanges();
    }));

    it('should contain a component to display the date', () => {
      const fields = fixture.debugElement.queryAll(By.css('ds-item-page-date-field'));
      expect(fields.length).toBeGreaterThanOrEqual(1);
    });

    it('should not contain a metadata only author field', () => {
      const fields = fixture.debugElement.queryAll(By.css('ds-item-page-author-field'));
      expect(fields.length).toBe(0);
    });

    it('should contain a mixed metadata and relationship field for authors', () => {
      const fields = fixture.debugElement.queryAll(By.css('.ds-item-page-mixed-author-field'));
      expect(fields.length).toBe(1);
    });

    it('should contain a component to display the abstract', () => {
      const fields = fixture.debugElement.queryAll(By.css('ds-item-page-abstract-field'));
      expect(fields.length).toBeGreaterThanOrEqual(1);
    });

    it('should contain a component to display the uri', () => {
      const fields = fixture.debugElement.queryAll(By.css('ds-item-page-uri-field'));
      expect(fields.length).toBeGreaterThanOrEqual(1);
    });

    it('should contain a component to display the collections', () => {
      const fields = fixture.debugElement.queryAll(By.css('ds-item-page-collections'));
      expect(fields.length).toBeGreaterThanOrEqual(1);
    });

    it('should not contain an iiif viewer component', () => {
      const fields = fixture.debugElement.queryAll(By.css('ds-mirador-viewer'));
      expect(fields.length).toBe(0);
    });
  });


  describe('with IIIF viewer', () => {

    beforeEach(waitForAsync(() => {
      const iiifEnabledMap: MetadataMap = {
        'dspace.iiif.enabled': [getIIIFEnabled(true)],
        'iiif.search.enabled': [getIIIFSearchEnabled(false)],
      };
      TestBed.compileComponents();
      fixture = TestBed.createComponent(UntypedItemComponent);
      comp = fixture.componentInstance;
      comp.object = getItem(iiifEnabledMap);
      fixture.detectChanges();
    }));

    it('should contain an iiif viewer component', () => {
      const fields = fixture.debugElement.queryAll(By.css('ds-mirador-viewer'));
      expect(fields.length).toBeGreaterThanOrEqual(1);
    });
    it('should not retrieve the query term for previous route', (): void => {
      expect(comp.iiifQuery$).toBeFalsy();
    });

  });

  describe('with IIIF viewer and search', () => {
    const localMockRouteService = {
      getPreviousUrl(): Observable<string> {
        return of('/search?query=test%20query&fakeParam=true');
      },
    };
    beforeEach(waitForAsync(() => {
      const iiifEnabledMap: MetadataMap = {
        'dspace.iiif.enabled': [getIIIFEnabled(true)],
        'iiif.search.enabled': [getIIIFSearchEnabled(true)],
      };
      TestBed.overrideProvider(RouteService, { useValue: localMockRouteService });
      TestBed.compileComponents();
      fixture = TestBed.createComponent(UntypedItemComponent);
      spyOn(localMockRouteService, 'getPreviousUrl').and.callThrough();
      comp = fixture.componentInstance;
      comp.object = getItem(iiifEnabledMap);
      fixture.detectChanges();
    }));

    it('should contain an iiif viewer component', () => {
      const fields = fixture.debugElement.queryAll(By.css('ds-mirador-viewer'));
      expect(fields.length).toBeGreaterThanOrEqual(1);
    });

    it('should retrieve the query term for previous route', (): void => {
      expect(comp.iiifQuery$.subscribe(result => expect(result).toEqual('test query')));
    });
  });

  describe('with IIIF viewer and search but no previous search query', () => {

    const localMockRouteService = {
      getPreviousUrl(): Observable<string> {
        return of('/item');
      },
    };
    beforeEach(waitForAsync(() => {
      const iiifEnabledMap: MetadataMap = {
        'dspace.iiif.enabled': [getIIIFEnabled(true)],
        'iiif.search.enabled': [getIIIFSearchEnabled(true)],
      };
      TestBed.overrideProvider(RouteService, { useValue: localMockRouteService });
      TestBed.compileComponents();
      fixture = TestBed.createComponent(UntypedItemComponent);

      comp = fixture.componentInstance;
      comp.object = getItem(iiifEnabledMap);
      fixture.detectChanges();
    }));

    it('should contain an iiif viewer component', () => {
      const fields = fixture.debugElement.queryAll(By.css('ds-mirador-viewer'));
      expect(fields.length).toBeGreaterThanOrEqual(1);
    });

    it('should not retrieve the query term for previous route', fakeAsync(() => {
      let emitted;
      comp.iiifQuery$.subscribe(result => emitted = result);
      tick(10);
      expect(emitted).toBeUndefined();
    }));

  });

});
