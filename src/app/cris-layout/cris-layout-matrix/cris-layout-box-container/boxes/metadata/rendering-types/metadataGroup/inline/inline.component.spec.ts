import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { CRIS_FIELD_RENDERING_MAP } from '../../../../../../../../../config/app-config.interface';
import { LayoutField } from '../../../../../../../../core/layout/models/box.model';
import { Item } from '../../../../../../../../core/shared/item.model';
import { TranslateLoaderMock } from '../../../../../../../../shared/mocks/translate-loader.mock';
import { DsDatePipe } from '../../../../../../../pipes/ds-date.pipe';
import { MetadataRenderComponent } from '../../../row/metadata-container/metadata-render/metadata-render.component';
import { layoutBoxesMap } from '../../metadata-box-rendering-map';
import { TextComponent } from '../../text/text.component';
import { InlineComponent } from './inline.component';

describe('InlineComponent', () => {
  let component: InlineComponent;
  let fixture: ComponentFixture<InlineComponent>;
  const testItem = Object.assign(new Item(), {
    bundles: of({}),
    metadata: {
      'dc.contributor.author': [
        {
          value: 'Donohue, Tim',
        },
        {
          value: 'Surname, Name',
        },
      ],
      'oairecerif.author.affiliation': [
        {
          value: 'Duraspace',
        },
        {
          value: '4Science',
        },
      ],
    },
  });
  const mockField = Object.assign({
    id: 1,
    fieldType: 'METADATAGROUP',
    metadata: 'dc.contributor.author',
    label: 'Author(s)',
    rendering: 'inline',
    style: 'container row',
    styleLabel: 'font-weight-bold col-4',
    styleValue: 'col',
    metadataGroup: {
      leading: 'dc.contributor.author',
      elements: [
        {
          metadata: 'dc.contributor.author',
          label: 'Author(s)',
          rendering: 'TEXT',
          fieldType: 'METADATA',
          style: null,
          styleLabel: 'font-weight-bold col-0',
          styleValue: 'col',
        },
        {
          metadata: 'oairecerif.author.affiliation',
          label: 'Affiliation(s)',
          rendering: 'TEXT',
          fieldType: 'METADATA',
          style: null,
          styleLabel: 'font-weight-bold col-0',
          styleValue: 'col',
        },
      ],
    },
  }) as LayoutField;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), BrowserAnimationsModule, DsDatePipe,
      MetadataRenderComponent,
      InlineComponent,
      TextComponent],
      providers: [
        { provide: 'fieldProvider', useValue: mockField },
        { provide: 'itemProvider', useValue: testItem },
        { provide: 'renderingSubTypeProvider', useValue: '' },
        { provide: 'tabNameProvider', useValue: '' },
        { provide: CRIS_FIELD_RENDERING_MAP, useValue: layoutBoxesMap },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(InlineComponent, {
      set: { changeDetection: ChangeDetectionStrategy.OnPush },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check metadata rendering', (done) => {
    const rowsFound = fixture.debugElement.queryAll(By.css('div.metadata-group-entry'));
    expect(rowsFound.length).toBe(2);

    let divFound = fixture.debugElement.query(By.css('div.metadata-group-entry:nth-child(1)'));

    let span = divFound.query(By.css('span.metadata-group-entry-value:nth-child(1)'));
    expect(span.nativeElement.textContent).toContain(testItem.metadata[mockField.metadataGroup.elements[0].metadata][0].value);
    span = divFound.query(By.css('span.metadata-group-entry-value:nth-child(2)'));
    expect(span.nativeElement.textContent).toContain(testItem.metadata[mockField.metadataGroup.elements[1].metadata][0].value);

    divFound = fixture.debugElement.query(By.css('div.metadata-group-entry:nth-child(2)'));
    span = divFound.query(By.css('span.metadata-group-entry-value:nth-child(1)'));
    expect(span.nativeElement.textContent).toContain(testItem.metadata[mockField.metadataGroup.elements[0].metadata][1].value);
    span = divFound.query(By.css('span.metadata-group-entry-value:nth-child(2)'));
    expect(span.nativeElement.textContent).toContain(testItem.metadata[mockField.metadataGroup.elements[1].metadata][1].value);
    done();

  });
});
