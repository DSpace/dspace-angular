import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
import { NormalizedObjectBuildService } from '../../../../core/cache/builders/normalized-object-build.service';
import { RemoteDataBuildService } from '../../../../core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../../core/cache/object-cache.service';
import { BundleDataService } from '../../../../core/data/bundle-data.service';
import { CommunityDataService } from '../../../../core/data/community-data.service';
import { DefaultChangeAnalyzer } from '../../../../core/data/default-change-analyzer.service';
import { DSOChangeAnalyzer } from '../../../../core/data/dso-change-analyzer.service';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { RelationshipService } from '../../../../core/data/relationship.service';
import { RemoteData } from '../../../../core/data/remote-data';
import { FindListOptions } from '../../../../core/data/request.models';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { Bundle } from '../../../../core/shared/bundle.model';
import { HALEndpointService } from '../../../../core/shared/hal-endpoint.service';
import { Item } from '../../../../core/shared/item.model';
import { MetadataMap } from '../../../../core/shared/metadata.models';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { UUIDService } from '../../../../core/shared/uuid.service';
import { MockTranslateLoader } from '../../../../shared/mocks/mock-translate-loader';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/testing/utils';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { FollowLinkConfig } from '../../../../shared/utils/follow-link-config.model';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { GenericItemPageFieldComponent } from '../../field-components/specific-field/generic/generic-item-page-field.component';
import { createRelationshipsObservable } from '../shared/item.component.spec';
import { PublicationComponent } from './publication.component';

const mockItem: Item = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [])),
  metadata: new MetadataMap(),
  relationships: createRelationshipsObservable()
});

fdescribe('PublicationComponent', () => {
  let comp: PublicationComponent;
  let fixture: ComponentFixture<PublicationComponent>;

  beforeEach(async(() => {
    const mockBundleDataService = {
      findAllByItem: undefined,
      findByItemAndName(item: Item, bundleName: string, ...linksToFollow: Array<FollowLinkConfig<Bundle>>): Observable<RemoteData<Bitstream>> {
        return createSuccessfulRemoteDataObject$(new Bitstream());
      },
      findAllByBundle(bundle: Bundle, options?: FindListOptions, ...linksToFollow: Array<FollowLinkConfig<Bitstream>>): Observable<RemoteData<PaginatedList<Bitstream>>> {
        return createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [new Bitstream()]));
      }
    };
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: MockTranslateLoader
        }
      })],
      declarations: [PublicationComponent, GenericItemPageFieldComponent, TruncatePipe],
      providers: [
        { provide: ItemDataService, useValue: {} },
        { provide: TruncatableService, useValue: {} },
        { provide: RelationshipService, useValue: {} },
        { provide: ObjectCacheService, useValue: {} },
        { provide: UUIDService, useValue: {} },
        { provide: Store, useValue: {} },
        { provide: RemoteDataBuildService, useValue: {} },
        { provide: NormalizedObjectBuildService, useValue: {} },
        { provide: CommunityDataService, useValue: {} },
        { provide: HALEndpointService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: DSOChangeAnalyzer, useValue: {} },
        { provide: DefaultChangeAnalyzer, useValue: {} },
        { provide: BundleDataService, useValue: mockBundleDataService },
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(PublicationComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PublicationComponent);
    comp = fixture.componentInstance;
    comp.object = mockItem;
    fixture.detectChanges();
  }));

  it('should contain a component to display the date', () => {
    const fields = fixture.debugElement.queryAll(By.css('ds-item-page-date-field'));
    expect(fields.length).toBeGreaterThanOrEqual(1);
  });

  it('should contain a component to display the author', () => {
    const fields = fixture.debugElement.queryAll(By.css('ds-item-page-author-field'));
    expect(fields.length).toBeGreaterThanOrEqual(1);
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

});
