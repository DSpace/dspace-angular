import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { of } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { InlineComponent } from './inline.component';
import { Item } from '../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../core/layout/models/metadata-component.model';
import { TranslateLoaderMock } from '../../../../../shared/mocks/translate-loader.mock';
import { CrisLayoutLoaderDirective } from '../../../../directives/cris-layout-loader.directive';

describe('InlineComponent', () => {
  let component: InlineComponent;
  let fixture: ComponentFixture<InlineComponent>;
  const testItem = Object.assign(new Item(), {
    bundles: of({}),
    metadata: {
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
    }
  });
  const testField = Object.assign({
    id: 1,
    fieldType: 'METADATAGROUP',
    metadata: 'dc.contributor.author',
    label: 'Author(s)',
    rendering: 'inline',
    style: 'container row',
    styleLabel: 'font-weight-bold col-4',
    styleValue: 'col',
    metadataGroup : {
      leading: 'dc.contributor.author',
      elements: [
        {
          metadata: 'dc.contributor.author',
          label: 'Author(s)',
          rendering: 'TEXT',
          fieldType: 'METADATA',
          style: null,
          styleLabel: 'font-weight-bold col-0',
          styleValue: 'col'
        },
        {
          metadata: 'oairecerif.author.affiliation',
          label: 'Affiliation(s)',
          rendering: 'TEXT',
          fieldType: 'METADATA',
          style: null,
          styleLabel: 'font-weight-bold col-0',
          styleValue:  'col'
        }
      ]}
  }) as LayoutField;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }), BrowserAnimationsModule],
      declarations: [
        InlineComponent,
        CrisLayoutLoaderDirective
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineComponent);
    component = fixture.componentInstance;
    component.item = testItem;
    component.field = testField;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
