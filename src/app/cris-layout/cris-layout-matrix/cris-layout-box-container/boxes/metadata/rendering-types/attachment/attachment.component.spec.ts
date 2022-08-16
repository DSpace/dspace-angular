import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';

import { AttachmentComponent } from './attachment.component';
import { SharedModule } from '../../../../../../../shared/shared.module';
import { Item } from '../../../../../../../core/shared/item.model';
import { Observable, of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BitstreamDataService } from '../../../../../../../core/data/bitstream-data.service';
import { RemoteData } from '../../../../../../../core/data/remote-data';
import { Bitstream } from '../../../../../../../core/shared/bitstream.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../../../../shared/remote-data.utils';
import { FindListOptions } from '../../../../../../../core/data/request.models';
import { FollowLinkConfig } from '../../../../../../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../../../../../../../core/data/paginated-list.model';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../../../shared/mocks/translate-loader.mock';
import { createPaginatedList } from '../../../../../../../shared/testing/utils.test';
import { By } from '@angular/platform-browser';
import { AuthorizationDataService } from '../../../../../../../core/data/feature-authorization/authorization-data.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { FieldRenderingType } from '../metadata-box.decorator';
import { Store, StoreModule } from '@ngrx/store';
import { StoreMock } from '../../../../../../../shared/testing/store.mock';
import { AppState } from 'src/app/app.reducer';

describe('AttachmentComponent', () => {
  let component: AttachmentComponent;
  let fixture: ComponentFixture<AttachmentComponent>;

  const testItem = Object.assign(new Item(), {
    bundles: of({}),
    metadata: {
      'dc.identifier.doi': [
        {
          value: 'doi:10.1392/dironix'
        }
      ]
    },
    _links: {
      self: { href: 'obj-selflink' }
    },
    uuid: 'item-uuid',
  });

  const mockField: LayoutField = {
    metadata: '',
    label: 'Files',
    rendering: FieldRenderingType.ATTACHMENT,
    fieldType: 'BITSTREAM',
    style: null,
    styleLabel: 'test-style-label',
    styleValue: 'test-style-value',
    labelAsHeading: false,
    valuesInline: true,
    bitstream: {
      bundle: 'ORIGINAL',
      metadataField: 'dc.type',
      metadataValue: 'attachment'
    }
  };

  const bitstream1 = Object.assign(new Bitstream(), {
    id: 'bitstream4',
    uuid: 'bitstream4',
    metadata: {
      'dc.title': [
        {
          value: 'test'
        }
      ],
      'dc.type': [
        {
          value: 'test'
        }
      ],
      'dc.description': [
        {
          value: 'test'
        }
      ]
    },
    _links: {
      self: { href: 'obj-selflink' }
    }
  });
  const bitstream2 = Object.assign(new Bitstream(), {
    id: 'bitstream4',
    uuid: 'bitstream4',
    metadata: {
    },
    _links: {
      self: { href: 'obj-selflink' }
    }
  });

  const mockBitstreamDataService: any = jasmine.createSpyObj('BitstreamDataService', {
    getThumbnailFor(item: Item): Observable<RemoteData<Bitstream>> {
      return createSuccessfulRemoteDataObject$(new Bitstream());
    },
    findAllByItemAndBundleName: jasmine.createSpy('findAllByItemAndBundleName'),
  });


  // const mockBitstreamDataService = {
  //   getThumbnailFor(item: Item): Observable<RemoteData<Bitstream>> {
  //     return createSuccessfulRemoteDataObject$(new Bitstream());
  //   },
  //   findAllByItemAndBundleName(item: Item, bundleName: string, options?: FindListOptions, ...linksToFollow: FollowLinkConfig<Bitstream>[]): Observable<RemoteData<PaginatedList<Bitstream>>> {
  //     return createSuccessfulRemoteDataObject$(createPaginatedList([bitstream1]));
  //   },
  // };

  const mockAuthorizedService = jasmine.createSpyObj('AuthorizationDataService', {
    isAuthorized: jasmine.createSpy('isAuthorized')
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }),
        RouterTestingModule,
        SharedModule,
      StoreModule.forRoot({}),
      ],
      declarations: [AttachmentComponent],
      providers: [
        { provide: 'fieldProvider', useValue: mockField },
        { provide: 'itemProvider', useValue: testItem },
        { provide: 'renderingSubTypeProvider', useValue: '' },
        { provide: BitstreamDataService, useValue: mockBitstreamDataService },
        { provide: AuthorizationDataService, useValue: mockAuthorizedService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentComponent);
    component = fixture.componentInstance;
    mockAuthorizedService.isAuthorized.and.returnValues(of(true), of(true));
    mockBitstreamDataService.findAllByItemAndBundleName.and.returnValues(createSuccessfulRemoteDataObject$(createPaginatedList([bitstream1])));
    component.item = testItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check metadata rendering', fakeAsync(() => {
    flush();
    const valueFound = fixture.debugElement.queryAll(By.css('ds-file-download-link'));
    expect(valueFound.length).toBe(1);
  }));

  it('check value style', (done) => {
    const spanValueFound = fixture.debugElement.queryAll(By.css('.test-style-value'));
    expect(spanValueFound.length).toBe(1);
    done();
  });


  describe('when attachment has no metadata', () => {

    beforeEach(() => {
      mockBitstreamDataService.findAllByItemAndBundleName.and.returnValues(createSuccessfulRemoteDataObject$(createPaginatedList([bitstream2])));
      component.item = testItem;
      component.ngOnInit();
      fixture.detectChanges();
    });
    it('Should not render title part', () => {
      expect(fixture.debugElement.query(By.css('[data-test="title"]'))).toBeFalsy();
    });
    it('Should not render type part', () => {
      expect(fixture.debugElement.query(By.css('[data-test="type"]'))).toBeFalsy();
    });
    it('Should not render description part', () => {
      expect(fixture.debugElement.query(By.css('[data-test="description"]'))).toBeFalsy();
    });

  });


  describe('when attachment has dc.title,dc.type & dc.description', () => {
    it('Should render title part', () => {
      expect(fixture.debugElement.query(By.css('[data-test="title"]'))).toBeTruthy();
    });
    it('Should render type part', () => {
      expect(fixture.debugElement.query(By.css('[data-test="type"]'))).toBeTruthy();
    });
    it('Should render description part', () => {
      expect(fixture.debugElement.query(By.css('[data-test="description"]'))).toBeTruthy();
    });
  });


});
