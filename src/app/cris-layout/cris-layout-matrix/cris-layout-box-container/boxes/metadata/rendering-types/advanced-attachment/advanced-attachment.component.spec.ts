import { attachmentsMock } from '../../../../../../../shared/mocks/attachments.mock';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';

import { AdvancedAttachmentComponent } from './advanced-attachment.component';
import { Item } from '../../../../../../../core/shared/item.model';
import { Observable, of } from 'rxjs';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { BitstreamDataService } from '../../../../../../../core/data/bitstream-data.service';
import { RemoteData } from '../../../../../../../core/data/remote-data';
import { Bitstream } from '../../../../../../../core/shared/bitstream.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../../../../shared/remote-data.utils';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../../../shared/mocks/translate-loader.mock';
import { createPaginatedList } from '../../../../../../../shared/testing/utils.test';
import { By } from '@angular/platform-browser';
import {
  AuthorizationDataService
} from '../../../../../../../core/data/feature-authorization/authorization-data.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { FieldRenderingType } from '../metadata-box.decorator';
import { FileSizePipe } from '../../../../../../../shared/utils/file-size-pipe';

describe('AdvancedAttachmentComponent', () => {
  let component: AdvancedAttachmentComponent;
  let fixture: ComponentFixture<AdvancedAttachmentComponent>;
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
    rendering: FieldRenderingType.ADVANCEDATTACHMENT,
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
    rendering: FieldRenderingType.ADVANCEDATTACHMENT,
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
    rendering: FieldRenderingType.ADVANCEDATTACHMENT,
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
    metadata: {},
    _links: {
      self: { href: 'obj-selflink' }
    }
  });

  const mockBitstreamDataService: any = jasmine.createSpyObj('BitstreamDataService', {
    getThumbnailFor(item: Item): Observable<RemoteData<Bitstream>> {
      return createSuccessfulRemoteDataObject$(new Bitstream());
    },
    findAllByItemAndBundleName: jasmine.createSpy('findAllByItemAndBundleName'),
    findByItem: jasmine.createSpy('findByItem'),
  });

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
        RouterTestingModule
      ],
      declarations: [AdvancedAttachmentComponent, FileSizePipe],
      providers: [
        { provide: 'fieldProvider', useValue: mockField },
        { provide: 'itemProvider', useValue: testItem },
        { provide: 'renderingSubTypeProvider', useValue: '' },
        { provide: 'tabNameProvider', useValue: '' },
        { provide: BitstreamDataService, useValue: mockBitstreamDataService },
        { provide: AuthorizationDataService, useValue: mockAuthorizedService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    };
  };

  describe('when metadata configuration is present', () => {

    describe('and pagination is disabled', () => {
      beforeEach(() => {
        TestBed.configureTestingModule(getDefaultTestBedConf());
        fixture = TestBed.createComponent(AdvancedAttachmentComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        mockAuthorizedService.isAuthorized.and.returnValues(of(true), of(true));
        component.envPagination.enabled = false;
        mockBitstreamDataService.findAllByItemAndBundleName.and.returnValues(createSuccessfulRemoteDataObject$(createPaginatedList([bitstream1])));
        mockBitstreamDataService.findByItem.and.returnValues(createSuccessfulRemoteDataObject$(createPaginatedList([bitstream1])));
        let spy = spyOn(component, 'getBitstreamsByItem');
        spy.and.returnValue(of(createPaginatedList(attachmentsMock)));
        component.item = testItem;
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should retrieve bitstreams without pagination', fakeAsync(() => {
        flush();
        expect(component.getBitstreamsByItem).toHaveBeenCalled();
      }));

      it('should not show view more button', fakeAsync(() => {
        flush();
        expect(fixture.debugElement.query(By.css('button[data-test="view-more"]'))).toBeNull();
      }));

      it('should render the proper entry number', fakeAsync(() => {
        flush();
        const valueFound = fixture.debugElement.queryAll(By.css('[data-test="attachment-info"]'));
        expect(valueFound.length).toBe(3);
      }));

    });

    describe('when pagination is enabled', () => {
      beforeEach(() => {
        TestBed.configureTestingModule(getDefaultTestBedConf());
        fixture = TestBed.createComponent(AdvancedAttachmentComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        mockAuthorizedService.isAuthorized.and.returnValues(of(true), of(true));
        component.envPagination.enabled = true;
        let spy = spyOn(component, 'getBitstreamsByItem');
        spy.and.returnValue(of(createPaginatedList([bitstream1, bitstream1])));
        component.item = testItem;
        fixture.detectChanges();
      });

      it('should show view more button', () => {
        expect(fixture.debugElement.query(By.css('button[data-test="view-more"]'))).toBeTruthy();
      });

      it('should show 2 elements', () => {
        expect(fixture.debugElement.queryAll(By.css('[data-test="attachment-info"]')).length).toEqual(2);
      });

      it('and view more button is clicked it should show 4 elements', () => {
        (component.getBitstreamsByItem as any).and.returnValue(of(createPaginatedList([bitstream1, bitstream1])));
        const btn = fixture.debugElement.query(By.css('button[data-test="view-more"]'));
        fixture.detectChanges();
        btn.nativeElement.click();
        fixture.detectChanges();
        expect(fixture.debugElement.queryAll(By.css('[data-test="attachment-info"]')).length).toEqual(4);
      });

    });
  });

  describe('when metadata configuration is not present', () => {

    describe('and pagination is disabled', () => {
      beforeEach(() => {
        TestBed.configureTestingModule(getDefaultTestBedConf());
        fixture = TestBed.createComponent(AdvancedAttachmentComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        mockAuthorizedService.isAuthorized.and.returnValues(of(true), of(true));
        component.envPagination.enabled = false;
        component.envMetadata = [];
        mockBitstreamDataService.findAllByItemAndBundleName.and.returnValues(createSuccessfulRemoteDataObject$(createPaginatedList([bitstream1])));
        let spy = spyOn(component, 'getBitstreamsByItem');
        spy.and.returnValue(of(createPaginatedList(attachmentsMock)));
        component.item = testItem;
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should retrieve bitstreams without pagination', fakeAsync(() => {
        flush();
        expect(component.getBitstreamsByItem).toHaveBeenCalled();
      }));

      it('should not show view more button', fakeAsync(() => {
        flush();
        expect(fixture.debugElement.query(By.css('button[data-test="view-more"]'))).toBeNull();
      }));

      it('should render the proper entry number', fakeAsync(() => {
        flush();
        const valueFound = fixture.debugElement.queryAll(By.css('[data-test="attachment-info"]'));
        expect(valueFound.length).toBe(3);
      }));

    });

    describe('when pagination is enabled', () => {
      beforeEach(() => {
        TestBed.configureTestingModule(getDefaultTestBedConf());
        fixture = TestBed.createComponent(AdvancedAttachmentComponent);
        component = fixture.componentInstance;
        component.envMetadata = [];
        de = fixture.debugElement;
        mockAuthorizedService.isAuthorized.and.returnValues(of(true), of(true));
        component.envPagination.enabled = true;
        let spy = spyOn(component, 'getBitstreamsByItem');
        spy.and.returnValue(of(createPaginatedList([bitstream1, bitstream1])));
        component.item = testItem;
        fixture.detectChanges();
      });

      it('should show view more button', () => {
        expect(fixture.debugElement.query(By.css('button[data-test="view-more"]'))).toBeTruthy();
      });

      it('should show 2 elements', () => {
        expect(fixture.debugElement.queryAll(By.css('[data-test="attachment-info"]')).length).toEqual(2);
      });

      it('and view more button is clicked it should show 4 elements', () => {
        const btn = fixture.debugElement.query(By.css('button[data-test="view-more"]'));
        (component.getBitstreamsByItem as any).and.returnValue(of(createPaginatedList([bitstream1, bitstream1])));
        fixture.detectChanges();
        btn.nativeElement.click();
        fixture.detectChanges();
        expect(fixture.debugElement.queryAll(By.css('[data-test="attachment-info"]')).length).toEqual(4);
      });

    });
  });

});
