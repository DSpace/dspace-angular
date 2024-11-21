import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { Item } from 'src/app/core/shared/item.model';
import { MetadataValue } from 'src/app/core/shared/metadata.models';

import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { ConfigurationDataService } from './../../../core/data/configuration-data.service';
import { TranslateLoaderMock } from './../../testing/translate-loader.mock';
import { MetadataLinkViewOrcidComponent } from './metadata-link-view-orcid.component';

describe('MetadataLinkViewOrcidComponent', () => {
  let component: MetadataLinkViewOrcidComponent;
  let fixture: ComponentFixture<MetadataLinkViewOrcidComponent>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), BrowserAnimationsModule, MetadataLinkViewOrcidComponent],
      providers: [
        { provide: ConfigurationDataService, useValue: configurationDataService },
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MetadataLinkViewOrcidComponent);
    component = fixture.componentInstance;
    component.itemValue = testItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
