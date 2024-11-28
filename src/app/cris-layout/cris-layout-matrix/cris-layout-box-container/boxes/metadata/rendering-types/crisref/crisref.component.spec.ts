import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { CrisrefComponent } from './crisref.component';
import { Item } from '../../../../../../../core/shared/item.model';
import { TranslateLoaderMock } from '../../../../../../../shared/mocks/translate-loader.mock';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { MetadataValue } from '../../../../../../../core/shared/metadata.models';
import { FieldRenderingType } from '../metadata-box.decorator';
import { of } from 'rxjs';
import { createSuccessfulRemoteDataObject$ } from '../../../../../../../shared/remote-data.utils';
import { MetadataLinkViewComponent } from '../../../../../../../shared/metadata-link-view/metadata-link-view.component';
import { ItemDataService } from '../../../../../../../core/data/item-data.service';

describe('CrisrefComponent', () => {
  let component: CrisrefComponent;
  let fixture: ComponentFixture<CrisrefComponent>;

  const itemService = jasmine.createSpyObj('ItemDataService', {
    findByIdWithProjections: jasmine.createSpy('findByIdWithProjections')
  });
  const metadataValue = Object.assign(new MetadataValue(), {
    'value': 'test item title',
    'language': null,
    'authority': '1',
    'confidence': -1,
    'place': 0
  });

  const testItem = Object.assign(new Item(),
    {
      type: 'item',
      metadata: {
        'dc.author': [metadataValue]
      },
      uuid: 'test-item-uuid',
    }
  );

  const testPerson = Object.assign(new Item(), {
    id: '1',
    bundles: of({}),
    metadata: {
      'dspace.entity.type': [
        {
          value: 'Person'
        }
      ],
      'person.orgunit.id': [
        {
          value: 'OrgUnit',
          authority: '2'
        }
      ],
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

  const mockField: LayoutField = {
    'metadata': 'dc.title',
    'label': 'Title',
    'rendering': FieldRenderingType.CRISREF,
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
        { provide: ItemDataService, useValue: itemService },
      ],
      declarations: [CrisrefComponent, MetadataLinkViewComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisrefComponent);
    component = fixture.componentInstance;
    itemService.findByIdWithProjections.and.returnValue(createSuccessfulRemoteDataObject$(testPerson));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check metadata rendering', fakeAsync(() => {
    flush();
    const spanValueFound = fixture.debugElement.queryAll(By.css('span.text-value'));
    expect(spanValueFound.length).toBe(1);

    const valueFound = fixture.debugElement.queryAll(By.css('ds-metadata-link-view'));
    expect(valueFound.length).toBe(1);
  }));

  it('check value style', (done) => {
    const spanValueFound = fixture.debugElement.queryAll(By.css('.test-style-value'));
    expect(spanValueFound.length).toBe(1);
    done();
  });

});

