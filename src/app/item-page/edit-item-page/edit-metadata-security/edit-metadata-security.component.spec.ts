import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMetadataSecurityComponent } from './edit-metadata-security.component';

describe('EditMetadataSecurityComponent', () => {
  let component: EditMetadataSecurityComponent;
  let fixture: ComponentFixture<EditMetadataSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMetadataSecurityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMetadataSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
