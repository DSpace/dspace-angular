import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
import { GenericItemPageFieldComponent } from '../../../../+item-page/simple/field-components/specific-field/generic/generic-item-page-field.component';
import { RemoteDataBuildService } from '../../../../core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../../core/cache/object-cache.service';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { CommunityDataService } from '../../../../core/data/community-data.service';
import { DefaultChangeAnalyzer } from '../../../../core/data/default-change-analyzer.service';
import { DSOChangeAnalyzer } from '../../../../core/data/dso-change-analyzer.service';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { RelationshipService } from '../../../../core/data/relationship.service';
import { RemoteData } from '../../../../core/data/remote-data';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { HALEndpointService } from '../../../../core/shared/hal-endpoint.service';
import { Item } from '../../../../core/shared/item.model';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { UUIDService } from '../../../../core/shared/uuid.service';
import { isNotEmpty } from '../../../../shared/empty.util';
import { MockTranslateLoader } from '../../../../shared/mocks/mock-translate-loader';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/testing/utils';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { JournalComponent } from './journal.component';

let comp: JournalComponent;
let fixture: ComponentFixture<JournalComponent>;

const mockItem: Item = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [])),
  metadata: {
    'creativeworkseries.issn': [
      {
        language: 'en_US',
        value: '1234'
      }
    ],
    'creativework.publisher': [
      {
        language: 'en_US',
        value: 'a publisher'
      }
    ],
    'dc.description': [
      {
        language: 'en_US',
        value: 'desc'
      }
    ]
  }
});

describe('JournalComponent', () => {
  const mockBitstreamDataService = {
    getThumbnailFor(item: Item): Observable<RemoteData<Bitstream>> {
      return createSuccessfulRemoteDataObject$(new Bitstream());
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: MockTranslateLoader
        }
      })],
      declarations: [JournalComponent, GenericItemPageFieldComponent, TruncatePipe],
      providers: [
        { provide: ItemDataService, useValue: {} },
        { provide: TruncatableService, useValue: {} },
        { provide: RelationshipService, useValue: {} },
        { provide: ObjectCacheService, useValue: {} },
        { provide: UUIDService, useValue: {} },
        { provide: Store, useValue: {} },
        { provide: RemoteDataBuildService, useValue: {} },
        { provide: CommunityDataService, useValue: {} },
        { provide: HALEndpointService, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: DSOChangeAnalyzer, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: DefaultChangeAnalyzer, useValue: {} },
        { provide: BitstreamDataService, useValue: mockBitstreamDataService },
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(JournalComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(JournalComponent);
    comp = fixture.componentInstance;
    comp.object = mockItem;
    fixture.detectChanges();
  }));

  for (const key of Object.keys(mockItem.metadata)) {
    it(`should be calling a component with metadata field ${key}`, () => {
      const fields = fixture.debugElement.queryAll(By.css('.item-page-fields'));
      expect(containsFieldInput(fields, key)).toBeTruthy();
    });
  }
});

function containsFieldInput(fields: DebugElement[], metadataKey: string): boolean {
  for (const field of fields) {
    const fieldComp = field.componentInstance;
    if (isNotEmpty(fieldComp.fields)) {
      if (fieldComp.fields.indexOf(metadataKey) > -1) {
        return true;
      }
    }
  }
  return false;
}
