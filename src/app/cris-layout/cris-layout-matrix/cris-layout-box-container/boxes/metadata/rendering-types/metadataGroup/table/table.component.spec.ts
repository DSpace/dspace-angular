import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { TableComponent } from './table.component';
import { Item } from '../../../../../../../../core/shared/item.model';
import { TranslateLoaderMock } from '../../../../../../../../shared/mocks/translate-loader.mock';
import { LayoutField } from '../../../../../../../../core/layout/models/box.model';
import { FieldRenderingType } from '../../metadata-box.decorator';
import { MetadataRenderComponent } from '../../../row/metadata-container/metadata-render/metadata-render.component';
import { DsDatePipe } from '../../../../../../../pipes/ds-date.pipe';
import { TextComponent } from '../../text/text.component';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  const testItem = Object.assign(new Item(), {
    uuid: 'itemUUID',
    id: 'itemUUID',
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
    },
    _links: {
      self: { href: 'item-selflink' }
    }
  });

  const mockField = Object.assign({
    id: 1,
    metadata: 'dc.contributor.author',
    fieldType: 'METADATAGROUP',
    label: 'Author(s)',
    rendering: FieldRenderingType.TABLE,
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
          styleValue: 'col'
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


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      })],
      providers: [
        { provide: 'fieldProvider', useValue: mockField },
        { provide: 'itemProvider', useValue: testItem },
        { provide: 'renderingSubTypeProvider', useValue: '' },
        { provide: 'tabNameProvider', useValue: '' },
      ],
      declarations: [
        DsDatePipe,
        MetadataRenderComponent,
        TableComponent,
        TextComponent
      ]
    }).overrideComponent(TableComponent, {
      set: { changeDetection: ChangeDetectionStrategy.OnPush }
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (done) => {
    expect(component).toBeTruthy();
    done();

  });

  it('check metadata rendering', (done) => {
    const rowsFound = fixture.debugElement.queryAll(By.css('tr'));
    expect(rowsFound.length).toBe(3);

    let rowFound = fixture.debugElement.query(By.css('tr:nth-child(1)'));
    let td = rowFound.query(By.css('td:nth-child(1)'));
    expect(td.nativeElement.textContent).toContain(mockField.metadataGroup.elements[0].label);
    td = rowFound.query(By.css('td:nth-child(2)'));
    expect(td.nativeElement.textContent).toContain(mockField.metadataGroup.elements[1].label);

    rowFound = fixture.debugElement.query(By.css('tr:nth-child(2)'));
    td = rowFound.query(By.css('td:nth-child(1)'));
    expect(td.nativeElement.textContent).toContain(testItem.metadata[mockField.metadataGroup.elements[0].metadata][0].value);
    td = rowFound.query(By.css('td:nth-child(2)'));
    expect(td.nativeElement.textContent).toContain(testItem.metadata[mockField.metadataGroup.elements[1].metadata][0].value);

    rowFound = fixture.debugElement.query(By.css('tr:nth-child(3)'));
    td = rowFound.query(By.css('td:nth-child(1)'));
    expect(td.nativeElement.textContent).toContain(testItem.metadata[mockField.metadataGroup.elements[0].metadata][1].value);
    td = rowFound.query(By.css('td:nth-child(2)'));
    expect(td.nativeElement.textContent).toContain(testItem.metadata[mockField.metadataGroup.elements[1].metadata][1].value);
    done();

  });
});
