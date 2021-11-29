import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';

import { ThumbnailComponent } from './thumbnail.component';
import { BitstreamDataService } from '../../../../../../../core/data/bitstream-data.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Item } from '../../../../../../../core/shared/item.model';
import { Observable, of } from 'rxjs';
import { SharedModule } from '../../../../../../../shared/shared.module';
import { RemoteData } from '../../../../../../../core/data/remote-data';
import { Bitstream } from '../../../../../../../core/shared/bitstream.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../../../../shared/remote-data.utils';
import { FindListOptions } from '../../../../../../../core/data/request.models';
import { FollowLinkConfig } from '../../../../../../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../../../../../../../core/data/paginated-list.model';
import { createPaginatedList } from '../../../../../../../shared/testing/utils.test';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../../../shared/testing/translate-loader.mock';
import { FieldRenderingType } from '../metadata-box.decorator';
import { AuthorizationDataService } from '../../../../../../../core/data/feature-authorization/authorization-data.service';
import { By } from '@angular/platform-browser';

describe('ThumbnailComponent', () => {
  let component: ThumbnailComponent;
  let fixture: ComponentFixture<ThumbnailComponent>;

  const testItem = Object.assign(new Item(), {
    bundles: of({}),
    metadata: {
      'dc.identifier.doi': [
        {
          value: 'doi:10.1392/dironix'
        }
      ]
    }
  });

  const mockField = Object.assign({
    id: 1,
    label: 'Field Label',
    metadata: 'dc.identifier.doi',
    rendering: FieldRenderingType.THUMBNAIL,
    fieldType: 'BITSTREAM',
    style: null,
    styleLabel: 'test-style-label',
    styleValue: 'test-style-value',
    bitstream: {
      bundle: 'ORIGINAL',
      metadataField: 'dc.type',
      metadataValue: 'thumbnail'
    }
  });

  const bitstream1 = Object.assign(new Bitstream(), {
    id: 'bitstream1',
    uuid: 'bitstream1'
  });

  const mockBitstreamDataService = {
    getThumbnailFor(item: Item): Observable<RemoteData<Bitstream>> {
      return createSuccessfulRemoteDataObject$(bitstream1);
    },
    findAllByItemAndBundleName(item: Item, bundleName: string, options?: FindListOptions, ...linksToFollow: FollowLinkConfig<Bitstream>[]): Observable<RemoteData<PaginatedList<Bitstream>>> {
      return createSuccessfulRemoteDataObject$(createPaginatedList([]));
    },
  };
  const mockAuthorizedService = jasmine.createSpyObj('AuthorizationDataService', {
    isAuthorized: jasmine.createSpy('isAuthorized')
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      declarations: [ ThumbnailComponent ],
      providers: [
        { provide: 'fieldProvider', useValue: mockField },
        { provide: 'itemProvider', useValue: testItem },
        { provide: 'renderingSubTypeProvider', useValue: '' },
        { provide: BitstreamDataService, useValue: mockBitstreamDataService },
        { provide: AuthorizationDataService, useValue: mockAuthorizedService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check metadata rendering', fakeAsync(() => {
    flush();
    const valueFound = fixture.debugElement.queryAll(By.css('ds-thumbnail '));
    expect(valueFound.length).toBe(1);
  }));

});
