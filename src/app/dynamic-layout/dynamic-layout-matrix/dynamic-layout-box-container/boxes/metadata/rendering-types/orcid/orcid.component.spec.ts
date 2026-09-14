import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfigurationDataService } from '@dspace/core/data/configuration-data.service';
import { LayoutField } from '@dspace/core/layout/models/box.model';
import { Item } from '@dspace/core/shared/item.model';
import { MetadataValue } from '@dspace/core/shared/metadata.models';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { ToDatePipe } from '../../../../../../../shared/access-control-form-container/access-control-array-form/to-date.pipe';
import { FieldRenderingType } from '../field-rendering-type';
import { OrcidComponent } from './orcid.component';

describe('OrcidComponent', () => {
  let component: OrcidComponent;
  let fixture: ComponentFixture<OrcidComponent>;

  const configurationDataService = jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$({ values: ['https://sandbox.orcid.org'] }),
  });

  const metadataValue = Object.assign(new MetadataValue(), {
    'value': '0000-0001-8918-3592',
    'language': 'en_US',
    'authority': null,
    'confidence': -1,
    'place': 0,
  });

  const testItem = Object.assign(new Item(),
    {
      type: 'item',
      metadata: {
        'person.identifier.orcid': [metadataValue],
        'dspace.orcid.authenticated': [
          {
            language: null,
            value: 'authenticated',
          },
        ],
      },
      uuid: 'test-item-uuid',
    },
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
    'valuesInline': true,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), BrowserAnimationsModule, OrcidComponent, ToDatePipe],
      providers: [
        { provide: 'fieldProvider', useValue: mockField },
        { provide: 'itemProvider', useValue: testItem },
        { provide: 'metadataValueProvider', useValue: metadataValue },
        { provide: 'renderingSubTypeProvider', useValue: '' },
        { provide: 'tabNameProvider', useValue: '' },
        { provide: ConfigurationDataService, useValue: configurationDataService },
      ],
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

