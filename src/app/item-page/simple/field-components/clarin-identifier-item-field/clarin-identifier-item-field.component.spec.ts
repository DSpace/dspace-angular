import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ClarinIdentifierItemFieldComponent } from './clarin-identifier-item-field.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/remote-data.utils';
import { Item } from '../../../../core/shared/item.model';
import { createPaginatedList } from '../../../../shared/testing/utils.test';
import { DOI_METADATA_FIELD } from '../clarin-generic-item-field/clarin-generic-item-field.component';
import { ItemIdentifierService } from '../../../../shared/item-identifier.service';

describe('ClarinIdentifierItemFieldComponent', () => {
  let component: ClarinIdentifierItemFieldComponent;
  let fixture: ComponentFixture<ClarinIdentifierItemFieldComponent>;
  let itemIdentifierService: ItemIdentifierService;

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
    itemIdentifierService = jasmine.createSpyObj('itemIdentifierService', {
      prettifyIdentifier: new Promise((res, rej) => { return 'awesome identifier'; }),
    });

    await TestBed.configureTestingModule({
      imports: [
        NgbTooltipModule,
      ],
      declarations: [ ClarinIdentifierItemFieldComponent ],
      providers: [
        { provide: ItemIdentifierService, useValue: itemIdentifierService }
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
