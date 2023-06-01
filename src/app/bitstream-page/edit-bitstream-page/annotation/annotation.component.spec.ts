import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { Item } from '../../../core/shared/item.model';
import { MetadataValueFilter } from '../../../core/shared/metadata.models';
import { Bundle } from '../../../core/shared/bundle.model';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of as observableOf } from 'rxjs';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { createPaginatedList } from '../../../shared/testing/utils.test';
import { AnnotationComponent } from './annotation.component';
import { MockBitstreamFormat1 } from '../../../shared/mocks/item.mock';
import { AnnotationUploadComponent } from '../annotation-upload/annotation-upload.component';
import { ItemDataService } from '../../../core/data/item-data.service';

const annotationBundleName = 'ANNOTATIONS';
const bitstreamIdDummy = '0b28ea75-e542-45f8-ad1a-a26c8d36ad89';
const bitstreamIdDummyNoMatch = 'a1d04bc7-f4c4-4353-a53f-a5e8dcde9e81';
let bitstreamService: BitstreamDataService;
let itemService: ItemDataService;
let fixture: ComponentFixture<AnnotationComponent>;
let comp: AnnotationComponent;

function getBitstream(bundleName: string, bitstreamId: string, bitstreamId2): Bitstream {
  return Object.assign(new Bitstream(), {
    uuid: bitstreamId,
    id: bitstreamId,
    metadata: {
      'dc.title': [
        {
          value: 'Bitstream one'
        }
      ]
    },
    format: undefined,
    _links: {
      self: 'bitstream-selflink'
    },
    bundle: createSuccessfulRemoteDataObject$({
      item: getItem(bundleName, bitstreamId2)
    })
  });
}

function getItem(bundleName: string, bitstreamId: string) {
  return createSuccessfulRemoteDataObject$(Object.assign(new Item(),
  {
    uuid: 'item-uuid',
      firstMetadataValue(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): string {
    return undefined;
  },
    bundles: createSuccessfulRemoteDataObject$(createPaginatedList([
      getBundle(bundleName, bitstreamId)
    ]))
    }
  ));
}

function getBundle(bundleName: string, bitstreamId: string) {
  return Object.assign(new Bundle(), {
    uuid: 'bundle-uuid',
    name: bundleName,
    firstMetadataValue(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): string {
      return undefined;
    },
    bitstreams: createSuccessfulRemoteDataObject$(createPaginatedList(getBitstreamList(bitstreamId)))
  });
}

function getBitstreamList(bitstreamId: string) {
  return [
    Object.assign(new Bitstream(),
      {
        sizeBytes: 10201,
        content: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/cf9b0c8e-a1eb-4b65-afd0-567366448713/content',
        format: createSuccessfulRemoteDataObject$(MockBitstreamFormat1),
        bundleName: 'ANNOTATIONS',
        _links:{
          self: {
            href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/cf9b0c8e-a1eb-4b65-afd0-567366448713'
          }
        },
        id: bitstreamId,
        uuid: bitstreamId,
        type: 'bitstream',
        metadata: {
          'dc.title': [
            {
              language: null,
              value: bitstreamId + '.json'
            }
          ]
        }
      })
  ];
}

describe('AnnotationComponent', () => {

  describe('create component', () => {

    beforeEach(waitForAsync(() => {

      itemService = jasmine.createSpyObj('itemService', {
        findById: getItem(annotationBundleName, bitstreamIdDummy)
      });

      bitstreamService = jasmine.createSpyObj('bitstreamService', {
        findListByHref: createSuccessfulRemoteDataObject$(createPaginatedList(getBitstreamList(bitstreamIdDummy))),
        findById: {},
        update: {},
        updateFormat: {},
        commitUpdates: {},
        patch: {}
      });

      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), RouterTestingModule],
        declarations: [AnnotationComponent, AnnotationUploadComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              data: observableOf({bitstream: createSuccessfulRemoteDataObject(getBitstream(annotationBundleName, bitstreamIdDummy, bitstreamIdDummy))}),
              snapshot: {queryParams: {}}
            }
          },
          {provide: BitstreamDataService, useValue: bitstreamService},
          {provide: ItemDataService, useValue: itemService},
          ChangeDetectorRef
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(AnnotationComponent);
      comp = fixture.componentInstance;
      fixture.detectChanges();
    });

    describe('with annotation bundle and existing file', () => {

      it('should create component', () => {
        expect(comp).toBeTruthy();
      });

      it('buttons should be to show existing annotation', () => {
        expect(comp.annotationBundle).toBeDefined();
        expect(comp.uploadButton).toBeFalse();
        expect(comp.showButton).toBeTrue();
        const btn = fixture.debugElement.nativeElement.querySelector('.btn-primary');
        expect(btn).toBeDefined();
      });

      it('should toggle the component view', () => {
        comp.toggleComponent();
        const child = fixture.debugElement.nativeElement.querySelector('ds-iiif-annotation-upload');
        expect(child).toBeDefined();
      });

    });
  });

  describe('with existing annotation bundle but no exising annotation file', () => {

    beforeEach(waitForAsync(() => {

      itemService = jasmine.createSpyObj('itemService', {
        findById: getItem(annotationBundleName, bitstreamIdDummyNoMatch)
      });

      bitstreamService = jasmine.createSpyObj('bitstreamService', {
        findListByHref: createSuccessfulRemoteDataObject$(createPaginatedList(getBitstreamList(bitstreamIdDummyNoMatch))),
        findById: createSuccessfulRemoteDataObject$(getBitstream(annotationBundleName, bitstreamIdDummy, bitstreamIdDummyNoMatch)),
        update: {},
        updateFormat: {},
        commitUpdates: {},
        patch: {}
      });

      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), RouterTestingModule],
        declarations: [AnnotationComponent, AnnotationUploadComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              data: observableOf({bitstream: createSuccessfulRemoteDataObject(getBitstream(annotationBundleName, bitstreamIdDummy, bitstreamIdDummyNoMatch))}),
              snapshot: {queryParams: {}}
            }
          },
          {provide: BitstreamDataService, useValue: bitstreamService},
          {provide: ItemDataService, useValue: itemService},
          ChangeDetectorRef
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(AnnotationComponent);
      comp = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('buttons should be set to show upload option', () => {
      expect(comp).toBeTruthy();
      expect(comp.annotationBundle).toBeDefined();
      expect(comp.uploadButton).toBeTrue();
      expect(comp.showButton).toBeTrue();
      const btn = fixture.debugElement.nativeElement.querySelector('.btn-danger');
      expect(btn).toBeDefined();
    });

  });

  describe('with no existing annotations bundle', () => {

    beforeEach(waitForAsync(() => {

      itemService = jasmine.createSpyObj('itemService', {
        findById: getItem('ORIGINAL', bitstreamIdDummy)
      });

      bitstreamService = jasmine.createSpyObj('bitstreamService', {
        findListByHref: createSuccessfulRemoteDataObject$(createPaginatedList(getBitstreamList(bitstreamIdDummyNoMatch))),
        findById: createSuccessfulRemoteDataObject$(getBitstream('ORIGINAL', bitstreamIdDummy, bitstreamIdDummyNoMatch)),
        update: {},
        updateFormat: {},
        commitUpdates: {},
        patch: {}
      });

      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), RouterTestingModule],
        declarations: [AnnotationComponent, AnnotationUploadComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              data: observableOf({bitstream: createSuccessfulRemoteDataObject(getBitstream('ORIGINAL', bitstreamIdDummy, bitstreamIdDummyNoMatch))}),
              snapshot: {queryParams: {}}
            }
          },
          {provide: BitstreamDataService, useValue: bitstreamService},
          {provide: ItemDataService, useValue: itemService},
          ChangeDetectorRef
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(AnnotationComponent);
      comp = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('buttons should be set to show upload option', () => {
      expect(comp).toBeTruthy();
      expect(comp.annotationBundle).not.toBeDefined();
      expect(comp.uploadButton).toBeTrue();
      expect(comp.showButton).toBeTrue();
      const btn = fixture.debugElement.nativeElement.querySelector('.btn-danger');
      expect(btn).toBeDefined();
    });

  });
});
