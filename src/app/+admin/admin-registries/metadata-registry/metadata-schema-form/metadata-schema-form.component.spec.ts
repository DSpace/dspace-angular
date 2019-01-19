import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetadataSchemaFormComponent } from './metadata-schema-form.component';

describe('MetadataSchemaFormComponent', () => {
  let component: MetadataSchemaFormComponent;
  let fixture: ComponentFixture<MetadataSchemaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetadataSchemaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataSchemaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
