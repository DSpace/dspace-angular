import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateLoaderMock } from '../../../../../shared/testing/translate-loader.mock';
import { mockItemWithMetadataFieldsAndValue } from '../item-page-field.component.spec';
import { ItemPageUriFieldComponent } from './item-page-uri-field.component';
import { MetadataUriValuesComponent } from '../../../../field-components/metadata-uri-values/metadata-uri-values.component';
import { environment } from '../../../../../../environments/environment';
import { APP_CONFIG } from '../../../../../../config/app-config.interface';
import { BrowseDefinitionDataService } from '../../../../../core/browse/browse-definition-data.service';
import { BrowseDefinitionDataServiceStub } from '../../../../../shared/testing/browse-definition-data-service.stub';
import { ConfigurationDataService } from '../../../../../core/data/configuration-data.service';
import { createSuccessfulRemoteDataObject$ } from '../../../../../shared/remote-data.utils';
import { ConfigurationProperty } from '../../../../../core/shared/configuration-property.model';

let comp: ItemPageUriFieldComponent;
let fixture: ComponentFixture<ItemPageUriFieldComponent>;

const mockField = 'dc.identifier.uri';
const mockValue = 'test value';
const mockLabel = 'test label';

describe('ItemPageUriFieldComponent', () => {
  let mockConfigurationDataService: ConfigurationDataService;

  mockConfigurationDataService = jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
      name: 'property',
      values: [
        'value'
      ]
    })),
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      })],
      providers: [
        { provide: APP_CONFIG, useValue: environment },
        { provide: BrowseDefinitionDataService, useValue: BrowseDefinitionDataServiceStub },
        { provide: ConfigurationDataService, useValue: mockConfigurationDataService }
      ],
      declarations: [ItemPageUriFieldComponent, MetadataUriValuesComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemPageUriFieldComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ItemPageUriFieldComponent);
    comp = fixture.componentInstance;
    comp.item = mockItemWithMetadataFieldsAndValue([mockField], mockValue);
    comp.fields = [mockField];
    comp.label = mockLabel;
    fixture.detectChanges();
  }));

  it('should display display the correct metadata value', () => {
    expect(fixture.nativeElement.innerHTML).toContain(mockValue);
  });
});
