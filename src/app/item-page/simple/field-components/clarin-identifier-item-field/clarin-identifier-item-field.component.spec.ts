import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ClarinIdentifierItemFieldComponent } from './clarin-identifier-item-field.component';
import { ConfigurationDataService } from '../../../../core/data/configuration-data.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { ConfigurationProperty } from '../../../../core/shared/configuration-property.model';
import { Item } from '../../../../core/shared/item.model';
import { createPaginatedList } from '../../../../shared/testing/utils.test';
import { DOI_METADATA_FIELD } from '../clarin-generic-item-field/clarin-generic-item-field.component';

describe('ClarinIdentifierItemFieldComponent', () => {
  let component: ClarinIdentifierItemFieldComponent;
  let fixture: ComponentFixture<ClarinIdentifierItemFieldComponent>;

  const mockItem: Item = Object.assign(new Item(), {
    bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    metadata: {
      'dc.identifier.uri': [
        {
          language: 'en_US',
          value: 'some handle'
        }
      ]
    }
  });

  beforeEach(async () => {
    const configurationServiceSpy = jasmine.createSpyObj('configurationService', {
      findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
        name: 'test',
        values: [
          true
        ]
      })),
    });

    await TestBed.configureTestingModule({
      imports: [
        NgbTooltipModule,
      ],
      declarations: [ ClarinIdentifierItemFieldComponent ],
      providers: [
        { provide: ConfigurationDataService, useValue: configurationServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClarinIdentifierItemFieldComponent);
    component = fixture.componentInstance;
    component.item = mockItem;
    component.fields = [DOI_METADATA_FIELD];
    fixture.detectChanges();
  });

  it('should create', waitForAsync(() => {
    fixture.whenStable().then(() => {
      expect(component).toBeTruthy();
    });
  }));
});
