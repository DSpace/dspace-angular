import { bitstreamOrignialWithMetadata, bitstreamWithoutThumbnail, bitstreamWithThumbnail, bitstreamWithThumbnailWithMetadata } from './../../../../../../../shared/mocks/bitstreams.mock';
import { async, ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';

import { ThumbnailComponent } from './thumbnail.component';
import { BitstreamDataService } from '../../../../../../../core/data/bitstream-data.service';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { Item } from '../../../../../../../core/shared/item.model';
import { Observable, of } from 'rxjs';
import { SharedModule } from '../../../../../../../shared/shared.module';
import { Bitstream } from '../../../../../../../core/shared/bitstream.model';
import { FindListOptions } from '../../../../../../../core/data/request.models';
import { FollowLinkConfig } from '../../../../../../../shared/utils/follow-link-config.model';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../../../shared/testing/translate-loader.mock';
import { FieldRenderingType } from '../metadata-box.decorator';
import { AuthorizationDataService } from '../../../../../../../core/data/feature-authorization/authorization-data.service';
import { By } from '@angular/platform-browser';
import { createSuccessfulRemoteDataObject$ } from 'src/app/shared/remote-data.utils';
import { MetadataValue } from 'src/app/core/shared/metadata.models';

describe('ThumbnailComponent', () => {
  let component: ThumbnailComponent;
  let fixture: ComponentFixture<ThumbnailComponent>;
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
    entityType: 'Person'
  });

  const mockField = Object.assign({
    id: 1,
    label: 'Field Label',
    metadata: 'dc.identifier.doi',
    rendering: FieldRenderingType.THUMBNAIL,
    fieldType: 'BITSTREAM',
    style: null,
    styleLabel: 'font-weight-bold col-3',
    styleValue: null,
    bitstream: {
      bundle: 'ORIGINAL',
      metadataField: null,
      metadataValue: null
    }
  });

  const mockField1 = Object.assign({
    id: 1,
    label: 'Field Label',
    metadata: 'dc.identifier.doi',
    rendering: FieldRenderingType.THUMBNAIL,
    fieldType: 'BITSTREAM',
    style: null,
    styleLabel: 'font-weight-bold col-3',
    styleValue: null,
    bitstream: {
      bundle: 'ORIGINAL',
      metadataField: 'dc.type',
      metadataValue: 'personal picture'
    }
  });


  const mockBitstreamDataService = jasmine.createSpyObj('BitstreamDataService', {
    findAllByItemAndBundleName: jasmine.createSpy('findAllByItemAndBundleName')
  });


  const mockAuthorizedService = jasmine.createSpyObj('AuthorizationDataService', {
    isAuthorized: jasmine.createSpy('isAuthorized')
  });


  describe('When there is no metadata field to check', () => {

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
        declarations: [ThumbnailComponent],
        providers: [
          { provide: 'fieldProvider', useValue: mockField },
          { provide: 'itemProvider', useValue: testItem },
          { provide: 'renderingSubTypeProvider', useValue: '' },
          { provide: BitstreamDataService, useValue: mockBitstreamDataService },
          { provide: AuthorizationDataService, useValue: mockAuthorizedService }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      })
        .compileComponents();
    }));


    beforeEach(() => {
      fixture = TestBed.createComponent(ThumbnailComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      mockBitstreamDataService.findAllByItemAndBundleName.and.returnValue(of([]));
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('findAllByItemAndBundleName should have been called', () => {
      expect(mockBitstreamDataService.findAllByItemAndBundleName).toHaveBeenCalled();
    });



    describe('When bitstreams are empty', () => {

      beforeEach(() => {
        const spy = spyOn(component, 'getOriginalBitstreams');
        spy.and.returnValue(of([]));
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('check metadata rendering', fakeAsync(() => {
        const valueFound = fixture.debugElement.queryAll(By.css('ds-thumbnail'));
        expect(valueFound.length).toBe(1);
      }));

      it('should show default thumbnail', () => {
        const image = fixture.debugElement.query(By.css('img[src="assets/images/person-placeholder.svg"]'));
        expect(image).toBeTruthy();
      });

    });




    describe('When bitstreams are only original', () => {

      beforeEach(() => {
        const spy = spyOn(component, 'getOriginalBitstreams');
        spy.and.returnValue(of([bitstreamWithoutThumbnail]));
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('check metadata rendering', fakeAsync(() => {
        const valueFound = fixture.debugElement.queryAll(By.css('ds-thumbnail'));
        expect(valueFound.length).toBe(1);
      }));

      it('should show bitstream content image src', () => {
        const image = fixture.debugElement.query(By.css('img[src="http://localhost:8080/server/api/core/bitstreams/bitstream-6df9-40ef-9009-b3c90a4e6d5b/content"]'));
        expect(image).toBeTruthy();
      });

    });




    describe('When bitstreams are only thumbnail', () => {

      beforeEach(() => {
        const spy = spyOn(component, 'getOriginalBitstreams');
        spy.and.returnValue(of([bitstreamWithThumbnail]));
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('check metadata rendering', fakeAsync(() => {
        const valueFound = fixture.debugElement.queryAll(By.css('ds-thumbnail'));
        expect(valueFound.length).toBe(1);
      }));

      it('should show thumbnail content image src', () => {
        const image = fixture.debugElement.query(By.css('img[src="http://localhost:8080/server/api/core/bitstreams/thumbnail-6df9-40ef-9009-b3c90a4e6d5b/content"]'));
        expect(image).toBeTruthy();
      });

    });

  });


  describe('When there is dc.type metadata field to check', () => {

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
        declarations: [ThumbnailComponent],
        providers: [
          { provide: 'fieldProvider', useValue: mockField1 },
          { provide: 'itemProvider', useValue: testItem },
          { provide: 'renderingSubTypeProvider', useValue: '' },
          { provide: BitstreamDataService, useValue: mockBitstreamDataService },
          { provide: AuthorizationDataService, useValue: mockAuthorizedService }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      })
        .compileComponents();
    }));


    beforeEach(() => {
      fixture = TestBed.createComponent(ThumbnailComponent);
      component = fixture.componentInstance;
      de = fixture.debugElement;
      mockBitstreamDataService.findAllByItemAndBundleName.and.returnValue(of([]));
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('findAllByItemAndBundleName should have been called', () => {
      expect(mockBitstreamDataService.findAllByItemAndBundleName).toHaveBeenCalled();
    });

    describe('When bitstreams are empty', () => {

      beforeEach(() => {
        const spy = spyOn(component, 'getOriginalBitstreams');
        spy.and.returnValue(of([]));
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('check metadata rendering', fakeAsync(() => {
        const valueFound = fixture.debugElement.queryAll(By.css('ds-thumbnail'));
        expect(valueFound.length).toBe(1);
      }));

      it('should show default thumbnail', () => {
        const image = fixture.debugElement.query(By.css('img[src="assets/images/person-placeholder.svg"]'));
        expect(image).toBeTruthy();
      });

    });

    describe('When bitstreams are only original without the right metadata information', () => {

      beforeEach(() => {
        const spy = spyOn(component, 'getOriginalBitstreams');
        spy.and.returnValue(of([bitstreamWithoutThumbnail]));
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should not show bitstream content image src but the default image', () => {
        const image = fixture.debugElement.query(By.css('img[src="assets/images/person-placeholder.svg"]'));
        expect(image).toBeTruthy();
      });

    });

    describe('When bitstreams are thumbnail of original without the right metadata information', () => {

      beforeEach(() => {
        const spy = spyOn(component, 'getOriginalBitstreams');
        spy.and.returnValue(of([bitstreamWithThumbnail]));
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should not show thumbnail content image src but the default image', () => {
        const image = fixture.debugElement.query(By.css('img[src="assets/images/person-placeholder.svg"]'));
        expect(image).toBeTruthy();
      });

    });

    describe('When bitstreams are only original with the right metadata information', () => {

      beforeEach(() => {
        const spy = spyOn(component, 'getOriginalBitstreams');
        spy.and.returnValue(of([bitstreamOrignialWithMetadata]));
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should show bitstream content image src', () => {
        const image = fixture.debugElement.query(By.css('img[src="http://localhost:8080/server/api/core/bitstreams/bitstream-6df9-40ef-9009-b3c90a4e6d5b/content"]'));
        expect(image).toBeTruthy();
      });

    });

    describe('When bitstreams thumbnail of original bitsream with the right metadata information', () => {

      beforeEach(() => {
        const spy = spyOn(component, 'getOriginalBitstreams');
        spy.and.returnValue(of([bitstreamWithThumbnailWithMetadata]));
        component.ngOnInit();
        fixture.detectChanges();
      });

      it('should show thumbnail content image src', () => {
        const image = fixture.debugElement.query(By.css('img[src="http://localhost:8080/server/api/core/bitstreams/thumbnail-6df9-40ef-9009-b3c90a4e6d5b/content"]'));
        expect(image).toBeTruthy();
      });

    });

  });

});
