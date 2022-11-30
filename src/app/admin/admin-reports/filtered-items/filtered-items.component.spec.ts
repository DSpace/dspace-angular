import { waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateLoaderMock } from 'src/app/shared/mocks/translate-loader.mock';
import { FormBuilder } from '@angular/forms';
import { FilteredItemsComponent } from './filtered-items.component';
import { DspaceRestService } from 'src/app/core/dspace-rest/dspace-rest.service';
import { NgbAccordion, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of as observableOf } from 'rxjs';
import { RawRestResponse } from 'src/app/core/dspace-rest/raw-rest-response.model';
import { CommunityDataService } from 'src/app/core/data/community-data.service';
import { ObjectCacheService } from 'src/app/core/cache/object-cache.service';
import { ActionsSubject, ReducerManager, ReducerManagerDispatcher, StateObservable, Store, StoreModule } from '@ngrx/store';
import { UUIDService } from 'src/app/core/shared/uuid.service';
import { RemoteDataBuildService } from 'src/app/core/cache/builders/remote-data-build.service';
import { HALEndpointService } from 'src/app/core/shared/hal-endpoint.service';
import { DSOChangeAnalyzer } from 'src/app/core/data/dso-change-analyzer.service';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { BitstreamFormatDataService } from 'src/app/core/data/bitstream-format-data.service';
import { CollectionDataService } from 'src/app/core/data/collection-data.service';
import { MetadataSchemaDataService } from 'src/app/core/data/metadata-schema-data.service';
import { MetadataFieldDataService } from 'src/app/core/data/metadata-field-data.service';
import { StoreMock } from 'src/app/shared/testing/store.mock';

describe('FiltersComponent', () => {
  let component: FilteredItemsComponent;
  let fixture: ComponentFixture<FilteredItemsComponent>;
  let formBuilder: FormBuilder;

  const expected = {
    payload: {
      items: [],
      itemCount: 0
    },
    statusCode: 200,
    statusText: 'OK'
  } as RawRestResponse;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FilteredItemsComponent],
      imports: [
        NgbAccordionModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        HttpClientTestingModule,
        StoreModule.forRoot({})
      ],
      providers: [
        CommunityDataService,
        CollectionDataService,
        MetadataSchemaDataService,
        MetadataFieldDataService,
        //TranslateService,
        FormBuilder,
        DspaceRestService,
        // Starting here, these services not referenced directly by the component.
        ObjectCacheService,
        UUIDService,
        RemoteDataBuildService,
        HALEndpointService,
        DSOChangeAnalyzer,
        NotificationsService,
        BitstreamFormatDataService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    formBuilder = TestBed.inject(FormBuilder);

    fixture = TestBed.createComponent(FilteredItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should be displaying the collectionSelector panel initially', () => {
    let accordion: NgbAccordion = component.accordionComponent;
    expect(accordion.isExpanded('collectionSelector')).toBeTrue();
  });

  describe('expand', () => {
    beforeEach(() => {
      spyOn(component, 'postFilteredItems').and.returnValue(observableOf(expected));
      spyOn(component.results, 'deserialize');
      spyOn(component.accordionComponent, 'expand').and.callThrough();
      component.submit();
      fixture.detectChanges();
    });

    it('should be displaying the itemResults panel after submitting', waitForAsync(() => {
      fixture.whenStable().then(() => {
        expect(component.accordionComponent.expand).toHaveBeenCalledWith('itemResults');
        expect(component.accordionComponent.isExpanded('itemResults')).toBeTrue();
      });
    }));
  });
});
