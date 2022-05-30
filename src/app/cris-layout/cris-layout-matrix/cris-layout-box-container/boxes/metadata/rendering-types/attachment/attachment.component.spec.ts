import { attachmentsMock, attachmentWithUnspecified } from './../../../../../../../shared/mocks/attachments.mock';
import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

import { AttachmentComponent } from './attachment.component';
import { SharedModule } from '../../../../../../../shared/shared.module';
import { Item } from '../../../../../../../core/shared/item.model';
import { BitstreamDataService } from '../../../../../../../core/data/bitstream-data.service';
import { RemoteData } from '../../../../../../../core/data/remote-data';
import { Bitstream } from '../../../../../../../core/shared/bitstream.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../../../../shared/remote-data.utils';
import { FindListOptions } from '../../../../../../../core/data/request.models';
import { FollowLinkConfig } from '../../../../../../../shared/utils/follow-link-config.model';
import { PaginatedList } from '../../../../../../../core/data/paginated-list.model';
import { TranslateLoaderMock } from '../../../../../../../shared/mocks/translate-loader.mock';
import { createPaginatedList } from '../../../../../../../shared/testing/utils.test';
import { AuthorizationDataService } from '../../../../../../../core/data/feature-authorization/authorization-data.service';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { FieldRenderingType } from '../metadata-box.decorator';

describe('AttachmentComponent', () => {
  let component: AttachmentComponent;
  let fixture: ComponentFixture<AttachmentComponent>;
  let de: DebugElement;

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
      metadataField: null,
      metadataValue: null
    }
  };

  const mockFieldWithMetadata: LayoutField = {
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
      metadataValue: 'main article'
    }
  };

  const mockFieldWithRegexMetadata: LayoutField = {
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
      metadataValue: '(/^Test Article/i)'
    }
  };

  const bitstream1 = Object.assign(new Bitstream(), {
    id: 'bitstream4',
    uuid: 'bitstream4',
    metadata: {
      'dc.type': [
        {
          value: 'attachment'
        }
      ]
    },
    _links: {
      self: { href: 'obj-selflink' }
    }
  });

  const mockBitstreamDataService = {
    getThumbnailFor(item: Item): Observable<RemoteData<Bitstream>> {
      return createSuccessfulRemoteDataObject$(new Bitstream());
    },
    findAllByItemAndBundleName(item: Item, bundleName: string, options?: FindListOptions, ...linksToFollow: FollowLinkConfig<Bitstream>[]): Observable<RemoteData<PaginatedList<Bitstream>>> {
      return createSuccessfulRemoteDataObject$(createPaginatedList([bitstream1]));
    },
  };

  const mockAuthorizedService = jasmine.createSpyObj('AuthorizationDataService', {
    isAuthorized: jasmine.createSpy('isAuthorized')
  });
  const getDefaultTestBedConf = () => {
    return {
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }),
        RouterTestingModule,
        SharedModule
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
    };
  };
  describe('when field has no metadata key and value', () => {

    // waitForAsync beforeEach
    beforeEach(waitForAsync(() => {
      return TestBed.configureTestingModule(getDefaultTestBedConf());
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(AttachmentComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      mockAuthorizedService.isAuthorized.and.returnValues(of(true), of(true));
      let spy = spyOn(component, 'getBitstreams');
      spy.and.returnValue(of(attachmentsMock));
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


    it('should show unspecified attachment', () => {
      expect(de.query(By.css('[data-test="filename"]')).nativeElement.innerHTML).toBe('test-unspecified.pdf (127.37 KB)');
    });



    describe('when the field has metadata key and value set as value', () => {
      beforeEach(() => {
        // NOTE: Cannot override providers once components have been compiled, so TestBed needs to be reset
        TestBed.resetTestingModule();
        TestBed.configureTestingModule(getDefaultTestBedConf());
        TestBed.overrideProvider('fieldProvider', { useValue: mockFieldWithMetadata });
        fixture = TestBed.createComponent(AttachmentComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        let spy = spyOn(component, 'getBitstreams');
        spy.and.returnValue(of(attachmentsMock));
        component.item = testItem;
        fixture.detectChanges();
      });

      it('should show main article attachment', () => {
        expect(de.query(By.css('[data-test="filename"]')).nativeElement.innerHTML).toBe('main.pdf (127.37 KB)');
      });

    });


    describe('when the field has metadata key and value set as regex', () => {
      beforeEach(() => {
        // NOTE: Cannot override providers once components have been compiled, so TestBed needs to be reset
        TestBed.resetTestingModule();
        TestBed.configureTestingModule(getDefaultTestBedConf());
        TestBed.overrideProvider('fieldProvider', { useValue: mockFieldWithRegexMetadata });
        fixture = TestBed.createComponent(AttachmentComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        let spy = spyOn(component, 'getBitstreams');
        spy.and.returnValue(of(attachmentsMock));
        component.item = testItem;
        fixture.detectChanges();
      });

      it('should show regex article attachment', () => {
        expect(de.query(By.css('[data-test="filename"]')).nativeElement.innerHTML).toBe('main-regex.pdf (127.37 KB)');
      });

    });
  });
});
