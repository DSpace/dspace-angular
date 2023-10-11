import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataContainerComponent } from './metadata-container.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../../../shared/mocks/translate-loader.mock';
import { Item } from '../../../../../../../core/shared/item.model';
import { MetadataValue } from '../../../../../../../core/shared/metadata.models';
import { boxMetadata } from '../../../../../../../shared/testing/box.mock';
import { By } from '@angular/platform-browser';
import { FieldRenderingType } from '../../rendering-types/metadata-box.decorator';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { BitstreamDataService } from '../../../../../../../core/data/bitstream-data.service';
import { createSuccessfulRemoteDataObject$ } from '../../../../../../../shared/remote-data.utils';
import { createPaginatedList } from '../../../../../../../shared/testing/utils.test';
import { Bitstream } from '../../../../../../../core/shared/bitstream.model';

describe('MetadataContainerComponent', () => {
  let component: MetadataContainerComponent;
  let fixture: ComponentFixture<MetadataContainerComponent>;

  const metadataValue = Object.assign(new MetadataValue(), {
    'value': 'test item title',
    'language': null,
    'authority': null,
    'confidence': -1,
    'place': 0
  });

  const testItem = Object.assign(new Item(),
    {
      type: 'item',
      metadata: {
        'dc.title': [metadataValue],
        'dc.contributor.author': [
          {
            value: 'Donohue, Tim'
          },
          {
            value: 'Surname, Name'
          }
        ],
        'oairecerif.author.affiliation': [
          {
            value: 'Duraspace'
          },
          {
            value: '4Science'
          }
        ]
      },
      uuid: 'test-item-uuid',
    }
  );

  const fieldMock = {
    metadata: 'dc.title',
    label: 'Preferred name',
    rendering: null,
    fieldType: 'METADATA',
    style: null,
    styleLabel: 'test-style-label',
    styleValue: 'test-style-value',
    labelAsHeading: false,
    valuesInline: true
  };

  const fieldMockWithoutLabel = {
    metadata: 'dc.title',
    label: null,
    rendering: null,
    fieldType: 'METADATA',
    style: null,
    styleLabel: 'test-style-label',
    styleValue: 'test-style-value',
    labelAsHeading: false,
    valuesInline: true
  };

  const fieldMockWithoutMetadata = {
    metadata: 'dc.identifier',
    label: 'Preferred name',
    rendering: null,
    fieldType: 'METADATA',
    style: null,
    styleLabel: 'test-style-label',
    styleValue: 'test-style-value',
    labelAsHeading: false,
    valuesInline: true
  };

  const fieldStructuredMock = Object.assign({
    id: 1,
    metadata: 'dc.contributor.author',
    fieldType: 'METADATAGROUP',
    label: 'Author(s)',
    rendering: FieldRenderingType.TABLE,
    style: 'container row',
    styleLabel: 'test-group-style-label',
    styleValue: 'test-group-style-value',
    metadataGroup: {
      leading: 'dc.contributor.author',
      elements: [
        {
          metadata: 'dc.contributor.author',
          label: 'Author(s)',
          rendering: 'TEXT',
          fieldType: 'METADATA',
          style: null,
          styleLabel: 'test-style-label',
          styleValue: 'test-style-value',
        },
        {
          metadata: 'oairecerif.author.affiliation',
          label: 'Affiliation(s)',
          rendering: 'TEXT',
          fieldType: 'METADATA',
          style: null,
          styleLabel: 'font-weight-bold col-0',
          styleValue: 'col'
        }
      ]
    }
  }) as LayoutField;

  const bitstreamField = Object.assign({
    id: 1,
    label: 'Field Label',
    metadata: 'dc.identifier.doi',
    rendering: FieldRenderingType.ATTACHMENT,
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

  const mockBitstreamDataService = jasmine.createSpyObj('BitstreamDataService', {
    findShowableBitstreamsByItem: jasmine.createSpy('findShowableBitstreamsByItem')
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      providers: [
        { provide: BitstreamDataService, useValue: mockBitstreamDataService },
      ],
      declarations: [MetadataContainerComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataContainerComponent);
    component = fixture.componentInstance;
    component.item = testItem;
    component.box = boxMetadata;

    mockBitstreamDataService.findShowableBitstreamsByItem.and.returnValue(
      createSuccessfulRemoteDataObject$(createPaginatedList([]))
    );
  });

  describe('When field rendering type is not structured', () => {

    beforeEach(() => {
      component.field = fieldMock;
      fixture.detectChanges();
    });
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render metadata properly', (done) => {
      const spanValueFound = fixture.debugElement.queryAll(By.css('.test-style-label'));
      expect(spanValueFound.length).toBe(1);

      const valueFound = fixture.debugElement.queryAll(By.css('ds-metadata-render'));
      expect(valueFound.length).toBe(1);
      done();
    });
  });

  describe('When field rendering type is structured', () => {

    beforeEach(() => {
      component.field = fieldStructuredMock;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render metadata properly', (done) => {
      const spanValueFound = fixture.debugElement.queryAll(By.css('.test-group-style-label'));
      expect(spanValueFound.length).toBe(1);

      const valueFound = fixture.debugElement.queryAll(By.css('ds-metadata-render'));
      expect(valueFound.length).toBe(1);
      done();
    });
  });

  describe('When field has no label', () => {

    beforeEach(() => {
      component.field = fieldMockWithoutLabel;
      fixture.detectChanges();
    });
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render metadata properly', (done) => {
      const spanValueFound = fixture.debugElement.queryAll(By.css('.test-style-label'));
      expect(spanValueFound.length).toBe(0);

      const valueFound = fixture.debugElement.queryAll(By.css('ds-metadata-render'));
      expect(valueFound.length).toBe(1);
      done();
    });
  });

  describe('When item has not the field metadata', () => {

    beforeEach(() => {
      component.field = fieldMockWithoutMetadata;
      fixture.detectChanges();
    });
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should render metadata properly', (done) => {
      const spanValueFound = fixture.debugElement.queryAll(By.css('.test-style-label'));
      expect(spanValueFound.length).toBe(0);

      const valueFound = fixture.debugElement.queryAll(By.css('ds-metadata-render'));
      expect(valueFound.length).toBe(0);
      done();
    });
  });

  describe('When field type is bitstream', () => {
    beforeEach(() => {
      component.field = bitstreamField;
    });

    describe('and item has no bitstream', () => {

      beforeEach(() => {
        fixture.detectChanges();
      });
      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should not render metadata ', (done) => {
        const spanValueFound = fixture.debugElement.queryAll(By.css('.test-style-label'));
        expect(spanValueFound.length).toBe(0);

        const valueFound = fixture.debugElement.queryAll(By.css('ds-metadata-render'));
        expect(valueFound.length).toBe(0);
        done();
      });
    });

    describe('and item has bitstream', () => {

      beforeEach(() => {
        mockBitstreamDataService.findShowableBitstreamsByItem.and.returnValue(createSuccessfulRemoteDataObject$(createPaginatedList([bitstream1])));
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should render metadata ', (done) => {
        const spanValueFound = fixture.debugElement.queryAll(By.css('.test-style-label'));
        expect(spanValueFound.length).toBe(1);

        const valueFound = fixture.debugElement.queryAll(By.css('ds-metadata-render'));
        expect(valueFound.length).toBe(1);
        done();
      });
    });

    describe('and bitstream has metadata', () => {
      beforeEach(() => {
        component.field.bitstream.metadataField = 'metadataFieldTest';
        component.field.bitstream.metadataValue = 'metadataValueTest';
        fixture.detectChanges();
      });

      it('should use the metadata in filters', () => {
        expect(mockBitstreamDataService.findShowableBitstreamsByItem).toHaveBeenCalledWith(
          testItem.uuid,
          bitstreamField.bitstream.bundle,
          [ { metadataName: 'metadataFieldTest', metadataValue: 'metadataValueTest' } ]
        );
      });
    });

    describe('and bitstream doesnt have metadataValue', () => {
      beforeEach(() => {
        component.field.bitstream.metadataValue = undefined;
        fixture.detectChanges();
      });

      it('should use empty array in filters', () => {
        expect(mockBitstreamDataService.findShowableBitstreamsByItem).toHaveBeenCalledWith(
          testItem.uuid,
          bitstreamField.bitstream.bundle,
          [] // <--- empty array of filters
        );
      });
    });
  });
});
