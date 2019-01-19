import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataFieldFormComponent } from './metadata-field-form.component';

describe('MetadataFieldFormComponent', () => {
  let component: MetadataFieldFormComponent;
  let fixture: ComponentFixture<MetadataFieldFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetadataFieldFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataFieldFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
