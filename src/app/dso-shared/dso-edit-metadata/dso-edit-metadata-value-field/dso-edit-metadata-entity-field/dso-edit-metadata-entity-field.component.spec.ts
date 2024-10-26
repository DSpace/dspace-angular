import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DsoEditMetadataEntityFieldComponent } from './dso-edit-metadata-entity-field.component';
import { EntityTypeDataServiceStub } from '../../../../shared/testing/entity-type-data.service.stub';
import { EntityTypeDataService } from '../../../../core/data/entity-type-data.service';

describe('DsoEditMetadataEntityFieldComponent', () => {
  let component: DsoEditMetadataEntityFieldComponent;
  let fixture: ComponentFixture<DsoEditMetadataEntityFieldComponent>;

  let entityTypeService: EntityTypeDataServiceStub;

  beforeEach(async () => {
    entityTypeService = new EntityTypeDataServiceStub();

    await TestBed.configureTestingModule({
      declarations: [
        DsoEditMetadataEntityFieldComponent,
      ],
      providers: [
        { provide: EntityTypeDataService, useValue: entityTypeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DsoEditMetadataEntityFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
