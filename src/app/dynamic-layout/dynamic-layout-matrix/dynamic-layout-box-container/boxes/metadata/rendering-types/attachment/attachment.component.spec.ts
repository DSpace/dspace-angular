import {
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { LayoutField } from '@dspace/core/layout/models/box.model';
import { LocaleService } from '@dspace/core/locale/locale.service';
import { Bitstream } from '@dspace/core/shared/bitstream.model';
import { Item } from '@dspace/core/shared/item.model';
import { attachmentsMock } from '@dspace/core/testing/attachments.mock';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import { createPaginatedList } from '@dspace/core/testing/utils.test';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';

import { ThemedFileDownloadLinkComponent } from '../../../../../../../shared/file-download-link/themed-file-download-link.component';
import { TruncatableComponent } from '../../../../../../../shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../../../../shared/truncatable/truncatable-part/truncatable-part.component';
import { FileSizePipe } from '../../../../../../../shared/utils/file-size-pipe';
import { FieldRenderingType } from '../field-rendering-type';
import { AttachmentComponent } from './attachment.component';

describe('AttachmentComponent', () => {
  let component: AttachmentComponent;
  let fixture: ComponentFixture<AttachmentComponent>;
  let de: DebugElement;
  let localeService: any;

  const languageList = ['en;q=1', 'it;q=0.9', 'de;q=0.8', 'fr;q=0.7'];

  const testItem = Object.assign(new Item(), {
    bundles: of({}),
    metadata: {
      'dc.identifier.doi': [
        {
          value: 'doi:10.1392/dironix',
        },
      ],
    },
    _links: {
      self: { href: 'obj-selflink' },
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
      metadataValue: null,
    },
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
      metadataValue: 'main article',
    },
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
      metadataValue: '(/^Test Article/i)',
    },
  };

  const mockLocaleService = jasmine.createSpyObj('LocaleService', [
    'getCurrentLanguageCode',
    'getLanguageCodeList',
  ]);


  const bitstream1 = Object.assign(new Bitstream(), {
    id: 'bitstream4',
    uuid: 'bitstream4',
    metadata: {
      'dc.title': [
        {
          value: 'test',
        },
      ],
      'dc.type': [
        {
          value: 'test',
        },
      ],
      'dc.description': [
        {
          value: 'test',
        },
      ],
    },
    _links: {
      self: { href: 'obj-selflink' },
    },
  });
  const bitstream2 = Object.assign(new Bitstream(), {
    id: 'bitstream4',
    uuid: 'bitstream4',
    metadata: {
    },
    _links: {
      self: { href: 'obj-selflink' },
    },
  });

  const mockBitstreamDataService: any = jasmine.createSpyObj('BitstreamDataService', {
    getThumbnailFor(item: Item): Observable<RemoteData<Bitstream>> {
      return createSuccessfulRemoteDataObject$(new Bitstream());
    },
    findAllByItemAndBundleName: jasmine.createSpy('findAllByItemAndBundleName'),
    findByItem: jasmine.createSpy('findByItem'),
  });

  const mockAuthorizedService = jasmine.createSpyObj('AuthorizationDataService', {
    isAuthorized: jasmine.createSpy('isAuthorized'),
  });
  const getDefaultTestBedConf = () => {
    return {
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }),
      RouterTestingModule,
      AttachmentComponent,
      FileSizePipe,
      ],
      providers: [
        { provide: 'fieldProvider', useValue: mockField },
        { provide: 'itemProvider', useValue: testItem },
        { provide: 'renderingSubTypeProvider', useValue: '' },
        { provide: 'tabNameProvider', useValue: '' },
        { provide: BitstreamDataService, useValue: mockBitstreamDataService },
        { provide: AuthorizationDataService, useValue: mockAuthorizedService },
        { provide: LocaleService, useValue: mockLocaleService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    };
  };

  describe('when pagination is disabled', () => {
    beforeEach(() => {
      TestBed.configureTestingModule(getDefaultTestBedConf())
        .overrideComponent(AttachmentComponent, {
          remove: {
            imports: [
              TruncatableComponent,
              ThemedFileDownloadLinkComponent,
              TruncatablePartComponent,
            ],
          },
        });
      fixture = TestBed.createComponent(AttachmentComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      mockAuthorizedService.isAuthorized.and.returnValues(of(true), of(true));
      component.envPagination.enabled = false;
      mockBitstreamDataService.findAllByItemAndBundleName.and.returnValues(createSuccessfulRemoteDataObject$(createPaginatedList([bitstream1])));
      mockBitstreamDataService.findByItem.and.returnValues(createSuccessfulRemoteDataObject$(createPaginatedList([bitstream1])));
      localeService = TestBed.inject(LocaleService);
      localeService.getCurrentLanguageCode.and.returnValue(of('en'));
      localeService.getLanguageCodeList.and.returnValue(of(languageList));
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
      expect(fixture.debugElement.query(By.css('a[data-test="view-more"]'))).toBeNull();
    }));

    it('check metadata rendering', fakeAsync(() => {
      flush();
      const valueFound = fixture.debugElement.queryAll(By.css('ds-file-download-link'));
      expect(valueFound.length).toBe(3);
    }));

    it('check value style', (done) => {
      const spanValueFound = fixture.debugElement.queryAll(By.css('.test-style-value'));
      expect(spanValueFound.length).toBe(1);
      done();
    });

    it('should show information properly', () => {
      const titles = de.queryAll(By.css('[data-test="title"]'));
      expect(titles.length).toBe(3);
      expect(titles[0].nativeElement.innerHTML).toContain('test-unspecified.pdf (127.37 KB)');
      expect(titles[1].nativeElement.innerHTML).toContain('main.pdf (127.37 KB)');
      expect(titles[2].nativeElement.innerHTML).toContain('main-regex.pdf (127.37 KB)');
    });

    describe('and the field has metadata key and value set as value', () => {
      beforeEach(() => {
        // NOTE: Cannot override providers once components have been compiled, so TestBed needs to be reset
        TestBed.resetTestingModule();
        TestBed.configureTestingModule(getDefaultTestBedConf())
          .overrideComponent(AttachmentComponent, {
            remove: {
              imports: [
                TruncatableComponent,
                ThemedFileDownloadLinkComponent,
                TruncatablePartComponent,
              ],
            },
          });
        TestBed.overrideProvider('fieldProvider', { useValue: mockFieldWithMetadata });
        fixture = TestBed.createComponent(AttachmentComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        let spy = spyOn(component, 'getBitstreamsByItem');
        spy.and.returnValue(of(createPaginatedList([attachmentsMock[1]])));
        component.item = testItem;
        fixture.detectChanges();
      });

      it('should show main article attachment', () => {
        expect(de.query(By.css('[data-test="title"]')).nativeElement.innerHTML).toContain('main.pdf (127.37 KB)');
      });

    });

    describe('when the field has metadata key and value set as regex', () => {
      beforeEach(() => {
        // NOTE: Cannot override providers once components have been compiled, so TestBed needs to be reset
        TestBed.resetTestingModule();
        TestBed.configureTestingModule(getDefaultTestBedConf())
          .overrideComponent(AttachmentComponent, {
            remove: {
              imports: [
                TruncatableComponent,
                ThemedFileDownloadLinkComponent,
                TruncatablePartComponent,
              ],
            },
          });
        TestBed.overrideProvider('fieldProvider', { useValue: mockFieldWithRegexMetadata });
        fixture = TestBed.createComponent(AttachmentComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        let spy = spyOn(component, 'getBitstreamsByItem');
        spy.and.returnValue(of(createPaginatedList([attachmentsMock[2]])));
        component.item = testItem;
        fixture.detectChanges();
      });

      it('should show regex article attachment', () => {
        expect(de.query(By.css('[data-test="title"]')).nativeElement.innerHTML).toContain('main-regex.pdf (127.37 KB)');
      });

    });

    describe('and attachment has no metadata', () => {

      beforeEach(() => {
        // NOTE: Cannot override providers once components have been compiled, so TestBed needs to be reset
        TestBed.resetTestingModule();
        TestBed.configureTestingModule(getDefaultTestBedConf())
          .overrideComponent(AttachmentComponent, {
            remove: {
              imports: [
                TruncatableComponent,
                ThemedFileDownloadLinkComponent,
                TruncatablePartComponent,
              ],
            },
          });
        fixture = TestBed.createComponent(AttachmentComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        let spy = spyOn(component, 'getBitstreamsByItem');
        spy.and.returnValue(of(createPaginatedList([bitstream2])));
        component.item = testItem;
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

    describe('and attachment has dc.title,dc.type and dc.description', () => {

      beforeEach(() => {
        // NOTE: Cannot override providers once components have been compiled, so TestBed needs to be reset
        TestBed.resetTestingModule();
        TestBed.configureTestingModule(getDefaultTestBedConf())
          .overrideComponent(AttachmentComponent, {
            remove: {
              imports: [
                TruncatableComponent,
                ThemedFileDownloadLinkComponent,
                TruncatablePartComponent,
              ],
            },
          });
        fixture = TestBed.createComponent(AttachmentComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        let spy = spyOn(component, 'getBitstreamsByItem');
        spy.and.returnValue(of(createPaginatedList([bitstream1])));
        component.item = testItem;
        fixture.detectChanges();
      });

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

  describe('when pagination is enabled', () => {
    beforeEach(() => {
      TestBed.configureTestingModule(getDefaultTestBedConf())
        .overrideComponent(AttachmentComponent, {
          remove: {
            imports: [
              TruncatableComponent,
              ThemedFileDownloadLinkComponent,
              TruncatablePartComponent,
            ],
          },
        });
      fixture = TestBed.createComponent(AttachmentComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      mockAuthorizedService.isAuthorized.and.returnValues(of(true), of(true));
      component.envPagination.enabled = true;
      localeService = TestBed.inject(LocaleService);
      localeService.getCurrentLanguageCode.and.returnValue(of('en'));
      localeService.getLanguageCodeList.and.returnValue(of(languageList));
      let spy = spyOn(component, 'getBitstreamsByItem');
      spy.and.returnValue(of(createPaginatedList([bitstream1, bitstream1])));
      component.item = testItem;
      fixture.detectChanges();
    });

    it('should show view more button', () => {
      expect(fixture.debugElement.query(By.css('a[data-test="view-more"]'))).toBeTruthy();
    });

    it('should show 2 elements', () => {
      expect(fixture.debugElement.queryAll(By.css('ds-file-download-link')).length).toEqual(2);
    });

    it('and view more button is clicked it should show 4 elements', () => {
      const btn = fixture.debugElement.query(By.css('a[data-test="view-more"]'));
      (component.getBitstreamsByItem as any).and.returnValue(of(createPaginatedList([bitstream1, bitstream1])));
      fixture.detectChanges();
      btn.nativeElement.click();
      fixture.detectChanges();
      expect(fixture.debugElement.queryAll(By.css('ds-file-download-link')).length).toEqual(4);
    });

  });

});
