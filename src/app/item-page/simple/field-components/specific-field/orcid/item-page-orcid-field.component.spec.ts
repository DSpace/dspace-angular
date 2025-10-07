import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { BrowseService } from '../../../../../core/browse/browse.service';
import { BrowseDefinitionDataService } from '../../../../../core/browse/browse-definition-data.service';
import { ConfigurationDataService } from '../../../../../core/data/configuration-data.service';
import { ConfigurationProperty } from '../../../../../core/shared/configuration-property.model';
import { Item } from '../../../../../core/shared/item.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../../shared/remote-data.utils';
import { APP_CONFIG } from 'src/config/app-config.interface';
import { ItemPageOrcidFieldComponent } from './item-page-orcid-field.component';

describe('ItemPageOrcidFieldComponent', () => {
  let component: ItemPageOrcidFieldComponent;
  let fixture: ComponentFixture<ItemPageOrcidFieldComponent>;
  let configurationService: jasmine.SpyObj<ConfigurationDataService>;

  const mockItem = Object.assign(new Item(), {
    metadata: {
      'person.identifier.orcid': [
        {
          value: '0000-0002-1825-0097',
          language: null,
          authority: null,
          confidence: -1,
          place: 0,
        },
      ],
    },
  });

  const mockConfigProperty = Object.assign(new ConfigurationProperty(), {
    name: 'orcid.domain-url',
    values: ['https://sandbox.orcid.org'],
  });

  const mockAppConfig = {
    ui: {
      ssl: false,
      host: 'localhost',
      port: 4000,
      nameSpace: '/',
    },
    markdown: {
      enabled: false,
      mathjax: false,
    },
  };

  beforeEach(async () => {
    configurationService = jasmine.createSpyObj('ConfigurationDataService', ['findByPropertyName']);
    configurationService.findByPropertyName.and.returnValue(
      createSuccessfulRemoteDataObject$(mockConfigProperty),
    );

    const browseDefinitionDataServiceStub = {
      findAll: jasmine.createSpy('findAll').and.returnValue(of({})),
      getBrowseDefinitions: jasmine.createSpy('getBrowseDefinitions').and.returnValue(of([])),
    };

    const browseServiceStub = {
      getBrowseEntriesFor: jasmine.createSpy('getBrowseEntriesFor').and.returnValue(of({})),
      getBrowseDefinitions: jasmine.createSpy('getBrowseDefinitions').and.returnValue(of([])),
    };

    await TestBed.configureTestingModule({
      imports: [
        ItemPageOrcidFieldComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: ConfigurationDataService, useValue: configurationService },
        { provide: BrowseDefinitionDataService, useValue: browseDefinitionDataServiceStub },
        { provide: BrowseService, useValue: browseServiceStub },
        { provide: APP_CONFIG, useValue: mockAppConfig },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();

    fixture = TestBed.createComponent(ItemPageOrcidFieldComponent);
    component = fixture.componentInstance;
    component.item = mockItem;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should check if item has ORCID', () => {
    expect(component.hasOrcid()).toBe(true);
  });

  it('should return false when item has no ORCID', () => {
    component.item = Object.assign(new Item(), { metadata: {} });
    expect(component.hasOrcid()).toBe(false);
  });

  it('should construct ORCID URL on init', (done) => {
    fixture.detectChanges();

    component.orcidUrl$.subscribe(url => {
      expect(url).toBe('https://sandbox.orcid.org/0000-0002-1825-0097');
      done();
    });
  });

  it('should extract ORCID ID on init', (done) => {
    fixture.detectChanges();

    component.orcidId$.subscribe(id => {
      expect(id).toBe('0000-0002-1825-0097');
      done();
    });
  });

  it('should handle ORCID with leading slash', (done) => {
    component.item = Object.assign(new Item(), {
      metadata: {
        'person.identifier.orcid': [
          {
            value: '/0000-0002-1825-0097',
            language: null,
            authority: null,
            confidence: -1,
            place: 0,
          },
        ],
      },
    });

    component.ngOnInit();
    fixture.detectChanges();

    component.orcidUrl$.subscribe(url => {
      expect(url).toBe('https://sandbox.orcid.org/0000-0002-1825-0097');
      done();
    });
  });

  it('should return null when item has no ORCID metadata', (done) => {
    component.item = Object.assign(new Item(), { metadata: {} });
    component.ngOnInit();
    fixture.detectChanges();

    component.orcidUrl$.subscribe(url => {
      expect(url).toBeNull();
      done();
    });
  });
});
