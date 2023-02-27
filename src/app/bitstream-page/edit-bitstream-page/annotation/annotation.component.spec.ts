import { TestBed } from '@angular/core/testing';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { Item } from '../../../core/shared/item.model';
import { MetadataValueFilter } from '../../../core/shared/metadata.models';
import { Bundle } from '../../../core/shared/bundle.model';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { EditBitstreamPageComponent } from '../edit-bitstream-page.component';
import { FileSizePipe } from '../../../shared/utils/file-size-pipe';
import { VarDirective } from '../../../shared/utils/var.directive';
import { ActivatedRoute } from '@angular/router';
import { of as observableOf } from 'rxjs';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { createPaginatedList } from '../../../shared/testing/utils.test';
import { AnnotationComponent } from './annotation.component';
import { MockBitstreamFormat1 } from '../../../shared/mocks/item.mock';

const annotationBundleName = 'ANNOTATIONS';
const bitstreamIdDummy = '0b28ea75-e542-45f8-ad1a-a26c8d36ad89';
const bitstreamIdDummyNoMatch = 'a1d04bc7-f4c4-4353-a53f-a5e8dcde9e81';

function createRouteBitstream(annotationBundle: string, bitstreamId: string, bitstreamId2): Bitstream {
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
      item: createSuccessfulRemoteDataObject$(Object.assign(new Item(), {
        uuid: 'item-uuid',
        firstMetadataValue(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): string {
          return undefined;
        },
        bundles: createSuccessfulRemoteDataObject$(createPaginatedList([
          Object.assign(new Bundle(), {
            uuid: 'bundle-uuid',
            name: annotationBundle,
            firstMetadataValue(keyOrKeys: string | string[], valueFilter?: MetadataValueFilter): string {
              return undefined;
            },
            bitstreams: createSuccessfulRemoteDataObject$(createPaginatedList(createBitstreamList(bitstreamId2)))
          })
        ]))
      }))}
    )
  });
}

function createBitstreamList(bitstreamId: string) {
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

  describe('with existing annotation file for image', () => {

    let bitstreamService: BitstreamDataService;
    let fixture;
    let comp;

    beforeEach(async () => {

      bitstreamService = jasmine.createSpyObj('bitstreamService', {
        findListByHref: createSuccessfulRemoteDataObject$(createPaginatedList(createBitstreamList(bitstreamIdDummy))),
        findById: {},
        update: {},
        updateFormat: {},
        commitUpdates: {},
        patch: {}
      });

      await TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), RouterTestingModule],
        declarations: [EditBitstreamPageComponent, FileSizePipe, VarDirective],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              data: observableOf({bitstream: createSuccessfulRemoteDataObject(createRouteBitstream(annotationBundleName, bitstreamIdDummy, bitstreamIdDummy))}),
              snapshot: {queryParams: {}}
            }
          },
          {provide: BitstreamDataService, useValue: bitstreamService},
          ChangeDetectorRef
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    });

    beforeEach(async() => {
      fixture = TestBed.createComponent(AnnotationComponent);
      comp = fixture.componentInstance;
      fixture.detectChanges();
    });

      it('buttons should be to show existing annotation', () => {
        expect(comp).toBeTruthy();
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

  describe('with existing annotation bundle but no exising annotation file', () => {

    let bitstreamService: BitstreamDataService;
    let fixture;
    let comp;

    beforeEach(async () => {

      bitstreamService = jasmine.createSpyObj('bitstreamService', {
        findListByHref: createSuccessfulRemoteDataObject$(createPaginatedList(createBitstreamList(bitstreamIdDummyNoMatch))),
        findById: {},
        update: {},
        updateFormat: {},
        commitUpdates: {},
        patch: {}
      });

      await TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), RouterTestingModule],
        declarations: [EditBitstreamPageComponent, FileSizePipe, VarDirective],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              data: observableOf({bitstream: createSuccessfulRemoteDataObject(createRouteBitstream(annotationBundleName, bitstreamIdDummy, bitstreamIdDummyNoMatch))}),
              snapshot: {queryParams: {}}
            }
          },
          {provide: BitstreamDataService, useValue: bitstreamService},
          ChangeDetectorRef
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    });

    beforeEach(async() => {
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

    let bitstreamService: BitstreamDataService;
    let fixture;
    let comp;

    beforeEach(async () => {

      bitstreamService = jasmine.createSpyObj('bitstreamService', {
        findListByHref: createSuccessfulRemoteDataObject$(createPaginatedList(createBitstreamList(bitstreamIdDummyNoMatch))),
        findById: {},
        update: {},
        updateFormat: {},
        commitUpdates: {},
        patch: {}
      });

      await TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), RouterTestingModule],
        declarations: [EditBitstreamPageComponent, FileSizePipe, VarDirective],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: {
              data: observableOf({bitstream: createSuccessfulRemoteDataObject(createRouteBitstream('ORIGINAL', bitstreamIdDummy, bitstreamIdDummyNoMatch))}),
              snapshot: {queryParams: {}}
            }
          },
          {provide: BitstreamDataService, useValue: bitstreamService},
          ChangeDetectorRef
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    });

    beforeEach(async() => {
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
