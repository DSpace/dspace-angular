import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataRenderComponent } from './metadata-render.component';
import { MetadataValue } from '../../../../../../../../core/shared/metadata.models';
import { Item } from '../../../../../../../../core/shared/item.model';
import { boxMetadata } from '../../../../../../../../shared/testing/box.mock';
import { ChangeDetectionStrategy, Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { TextComponent } from '../../../rendering-types/text/text.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../../../../shared/mocks/translate-loader.mock';
import { DsDatePipe } from '../../../../../../../pipes/ds-date.pipe';
import { FieldRenderingType } from '../../../rendering-types/metadata-box.decorator';
import { LayoutField } from '../../../../../../../../core/layout/models/box.model';
import { TableComponent } from '../../../rendering-types/metadataGroup/table/table.component';
import { PLACEHOLDER_PARENT_METADATA } from '../../../../../../../../shared/form/builder/ds-dynamic-form-ui/ds-dynamic-form-constants';

describe('MetadataRenderComponent', () => {
  let component: MetadataRenderComponent;
  let fixture: ComponentFixture<MetadataRenderComponent>;

  const metadataValue = Object.assign(new MetadataValue(), {
    'value': 'test item title',
    'language': null,
    'authority': null,
    'confidence': -1,
    'place': 0
  });

  const metadataValueWithPlaceholder = Object.assign(new MetadataValue(), {
    'value': PLACEHOLDER_PARENT_METADATA,
    'language': null,
    'authority': null,
    'confidence': -1,
    'place': 0
  });

  const normalizedMetadataValue = Object.assign(new MetadataValue(), metadataValueWithPlaceholder,{
    'value': ''
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
        Injector,
        { provide: 'tabNameProvider', useValue: '' },
      ],
      declarations: [
        DsDatePipe,
        MetadataRenderComponent,
        TableComponent,
        TextComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(TableComponent, {
      set: { changeDetection: ChangeDetectionStrategy.OnPush }
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataRenderComponent);
    component = fixture.componentInstance;
    component.item = testItem;
    component.box = boxMetadata;

  });

  describe('When field rendering type is not structured', () => {
    beforeEach(() => {
      component.field = fieldMock;
    });

    it('Should apply word-break style to host element', () => {
      const hostElement = fixture.nativeElement;
      expect(getComputedStyle(hostElement).wordBreak).toBe('break-word');
    });

    describe('When field rendering type is not structured', () => {
      beforeEach(() => {
        component.metadataValue = metadataValue;
        fixture.detectChanges();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });
    });

    describe('and metadata value has placeholder', () => {
      beforeEach(() => {
        component.metadataValue = metadataValueWithPlaceholder;
        fixture.detectChanges();
      });

      it('should normalize metadata value', () => {

        expect(component.metadataValue).toEqual(normalizedMetadataValue);
      });
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
  });
});
