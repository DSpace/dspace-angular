/*
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { OrcidComponent } from './orcid.component';
import { Item } from '../../../../../../../core/shared/item.model';
import { TranslateLoaderMock } from '../../../../../../../shared/mocks/translate-loader.mock';
import { DsDatePipe } from '../../../../../../pipes/ds-date.pipe';
import { ConfigurationDataService } from '../../../../../../../core/data/configuration-data.service';
import { createSuccessfulRemoteDataObject$ } from '../../../../../../../shared/remote-data.utils';
import { MetadataBoxConfiguration } from '../../../../../../../core/layout/models/box.model';

export const testItem: Item = Object.assign(new Item(), {
  id: '0ec7ff22-f211-40ab-a69e-c819b0b1f357',
  uuid: '0ec7ff22-f211-40ab-a69e-c819b0b1f357',
  type: 'item',
  metadata: {
    'person.identifier.orcid': [
      {
        language: 'en_US',
        value: '0000-0001-8918-3592'
      }
    ],
    'dspace.orcid.authenticated': [
      {
        language: null,
        value: 'authenticated'
      }
    ]
  }
});

export const medataComponent: MetadataBoxConfiguration = {
  id: 'testTagBox',
  type: 'boxmetadataconfiguration',
  rows: [{
    style: 'row-style',
    cells: [{
      style: 'cell-style',
      fields: [
        {
          metadata: 'person.identifier.orcid',
          label: 'ORCID',
          rendering: 'orcid',
          fieldType: 'metadata',
          labelAsHeading: true,
          valuesInline: true
        }
      ]
    }]
  }]
};

describe('OrcidComponent', () => {
  let component: OrcidComponent;
  let fixture: ComponentFixture<OrcidComponent>;
  let configurationDataService;

  beforeEach(fakeAsync(() => {

    configurationDataService = jasmine.createSpyObj('configurationDataService', {
      findByPropertyName: createSuccessfulRemoteDataObject$({ values: ['https://sandbox.orcid.org'] })
    });

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }), BrowserAnimationsModule],
      declarations: [ OrcidComponent, DsDatePipe ],
      providers: [ { provide: ConfigurationDataService, useValue: configurationDataService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrcidComponent);
    component = fixture.componentInstance;
    component.item = testItem;
    component.field = medataComponent.rows[0].fields[0];
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('check metadata rendering',  fakeAsync(() => {
    tick();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const spanValueFound = fixture.debugElement.queryAll(By.css('span.txt-value'));
      expect(spanValueFound.length).toBe(1);
      expect(spanValueFound[0].nativeElement.textContent).toContain('0000-0001-8918-3592');

      const orcidLinkFound = fixture.debugElement.queryAll(By.css('a'));
      expect(orcidLinkFound.length).toBe(1);
      expect(orcidLinkFound[0].nativeElement.href).toBe('https://sandbox.orcid.org/0000-0001-8918-3592');

      const orcidIconFound = fixture.debugElement.queryAll(By.css('.orcid-icon'));
      expect(orcidIconFound.length).toBe(1);
      expect(orcidIconFound[0].nativeElement.src).toContain('assets/images/orcid.logo.icon.svg');

      const spanLabelFound = fixture.debugElement.query(By.css('div.' + medataComponent.rows[0].fields[0].style));
      const label: HTMLElement = spanLabelFound.nativeElement;
      expect(label.textContent).toContain(medataComponent.rows[0].fields[0].label);
    });

  }));
});
*/

import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { OrcidComponent } from './orcid.component';
import { Item } from '../../../../../../../core/shared/item.model';
import { TranslateLoaderMock } from '../../../../../../../shared/mocks/translate-loader.mock';
import { DsDatePipe } from '../../../../../../pipes/ds-date.pipe';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { MetadataValue } from '../../../../../../../core/shared/metadata.models';
import { FieldRenderingType } from '../metadata-box.decorator';
import { createSuccessfulRemoteDataObject$ } from '../../../../../../../shared/remote-data.utils';
import { ConfigurationDataService } from '../../../../../../../core/data/configuration-data.service';

describe('OrcidComponent', () => {
  let component: OrcidComponent;
  let fixture: ComponentFixture<OrcidComponent>;

  const configurationDataService = jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$({ values: ['https://sandbox.orcid.org'] })
  });

  const metadataValue = Object.assign(new MetadataValue(), {
    'value': '0000-0001-8918-3592',
    'language': 'en_US',
    'authority': null,
    'confidence': -1,
    'place': 0
  });

  const testItem = Object.assign(new Item(),
    {
      type: 'item',
      metadata: {
        'person.identifier.orcid': [metadataValue],
        'dspace.orcid.authenticated': [
          {
            language: null,
            value: 'authenticated'
          }
        ]
      },
      uuid: 'test-item-uuid',
    }
  );

  const mockField: LayoutField = {
    'metadata': 'person.identifier.orcid',
    'label': 'ORCID',
    'rendering': FieldRenderingType.ORCID,
    'fieldType': 'METADATA',
    'style': null,
    'styleLabel': 'test-style-label',
    'styleValue': 'test-style-value',
    'labelAsHeading': false,
    'valuesInline': true
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      }), BrowserAnimationsModule],
      providers: [
        { provide: 'fieldProvider', useValue: mockField },
        { provide: 'itemProvider', useValue: testItem },
        { provide: 'metadataValueProvider', useValue: metadataValue },
        { provide: 'renderingSubTypeProvider', useValue: '' },
        { provide: 'tabNameProvider', useValue: '' },
        { provide: ConfigurationDataService, useValue: configurationDataService}
      ],
      declarations: [OrcidComponent, DsDatePipe]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrcidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check metadata rendering',  fakeAsync(() => {
    tick();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const spanValueFound = fixture.debugElement.queryAll(By.css('span.txt-value'));
      expect(spanValueFound.length).toBe(1);
      expect(spanValueFound[0].nativeElement.textContent).toContain('0000-0001-8918-3592');

      const orcidLinkFound = fixture.debugElement.queryAll(By.css('a'));
      expect(orcidLinkFound.length).toBe(1);
      expect(orcidLinkFound[0].nativeElement.href).toBe('https://sandbox.orcid.org/0000-0001-8918-3592');

      const orcidIconFound = fixture.debugElement.queryAll(By.css('.orcid-icon'));
      expect(orcidIconFound.length).toBe(1);
      expect(orcidIconFound[0].nativeElement.src).toContain('assets/images/orcid.logo.icon.svg');
    });

  }));

  it('check value style', (done) => {
    const spanValueFound = fixture.debugElement.queryAll(By.css('.test-style-value'));
    expect(spanValueFound.length).toBe(1);
    done();
  });
});

